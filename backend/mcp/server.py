from fastmcp import FastMCP
from .functions import get_gemini_response, get_mayo_clinic_info, get_cdc_info

mcp = FastMCP("Health")

@mcp.tool()
def gemini_response(prompt: str) -> str:
    """Get a Gemini-powered health suggestion for a given prompt."""
    return get_gemini_response(prompt)

@mcp.tool()
def mayo_clinic_info(topic: str, keywords: list[str]) -> str:
    """Get relevant health information from Mayo Clinic for a given topic and keywords."""
    return get_mayo_clinic_info(topic, keywords)

@mcp.tool()
def cdc_info(topic: str, keywords: list[str]) -> str:
    """Get relevant health information from CDC for a given topic and keywords."""
    return get_cdc_info(topic, keywords)

if __name__ == "__main__":
    mcp.run(transport="sse", port=8000)
