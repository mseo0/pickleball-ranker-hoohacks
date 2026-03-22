import asyncio
from mcp import ClientSession
from mcp.client.sse import sse_client
from google import genai
from google.genai import types
import os

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
MCP_SERVER_URL = "http://localhost:8000/sse"
MAX_ITERATIONS = 10

tools = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="get_mayo_clinic_info",
            description="Get relevant health information from Mayo Clinic for a given topic and keywords.",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "topic": types.Schema(type=types.Type.STRING),
                    "keywords": types.Schema(type=types.Type.ARRAY, items=types.Schema(type=types.Type.STRING)),
                },
                required=["topic", "keywords"],
            ),
        ),
        types.FunctionDeclaration(
            name="get_cdc_info",
            description="Get relevant health information from CDC for a given topic and keywords.",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "topic": types.Schema(type=types.Type.STRING),
                    "keywords": types.Schema(type=types.Type.ARRAY, items=types.Schema(type=types.Type.STRING)),
                },
                required=["topic", "keywords"],
            ),
        ),
        types.FunctionDeclaration(
            name="get_gemini_response",
            description="Get a Gemini-powered health suggestion for a given prompt.",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "prompt": types.Schema(type=types.Type.STRING),
                },
                required=["prompt"],
            ),
        ),
    ]
)

async def ask_gemini_health(question: str, health_topic: str = "", keywords: list[str] = None) -> str:
    gemini = genai.Client(api_key=GEMINI_API_KEY)

    health_context = ""
    if health_topic:
        health_context = f"\nThe user's health topic of interest is '{health_topic}'."
    if keywords:
        health_context += f"\nRelevant keywords: {', '.join(keywords)}."

    system_prompt = f"""You are a health assistant. You answer questions related to health, wellness, and fitness using trusted sources like Mayo Clinic and CDC.
Use the provided tools whenever possible to look up health info and generate suggestions.
Keep your answers concise, practical, and evidence-based.
{health_context}"""

    config = types.GenerateContentConfig(tools=[tools], system_instruction=system_prompt)

    async with sse_client(MCP_SERVER_URL) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            chat = gemini.aio.chats.create(model="gemini-2.5-flash", config=config)
            response = await chat.send_message(question)

            for _ in range(MAX_ITERATIONS):
                fn_calls = [
                    p for p in response.candidates[0].content.parts
                    if p.function_call
                ]

                if not fn_calls:
                    return response.text

                fn_responses = []
                for part in fn_calls:
                    fc = part.function_call
                    print(f"[Tool Call] {fc.name}({', '.join(f'{k}={v!r}' for k, v in dict(fc.args).items())})")
                    result = await session.call_tool(fc.name, dict(fc.args))
                    result_text = " ".join(
                        c.text for c in result.content if hasattr(c, "text")
                    )
                    print(f"[Tool Result] {result_text}")
                    fn_responses.append(
                        types.Part.from_function_response(
                            name=fc.name,
                            response={"result": result_text},
                        )
                    )

                response = await chat.send_message(fn_responses)

    return response.text

if __name__ == "__main__":
    question = input("Health Query: ")
    topic = input("Health Topic (optional): ")
    keywords = input("Keywords (comma separated, optional): ")
    keywords_list = [k.strip() for k in keywords.split(",")] if keywords else []
    answer = asyncio.run(ask_gemini_health(question, topic, keywords_list))
    print(answer)