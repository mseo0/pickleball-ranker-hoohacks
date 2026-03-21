import os
import google.generativeai as genai
import requests
from bs4 import BeautifulSoup

def get_gemini_response(prompt: str, api_key: str = None) -> str:
    """
    Sends a prompt to the Gemini API and returns the response.
    Args:
        prompt (str): The prompt to send to Gemini.
        api_key (str, optional): Gemini API key. If not provided, will use GEMINI_API_KEY env var.
    Returns:
        str: The response from Gemini.
    """
    if api_key is None:
        api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Gemini API key not provided. Set GEMINI_API_KEY env var or pass as argument.")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash-lite')
    response = model.generate_content(prompt)
    return response.text

def get_mayo_clinic_info(topic: str, keywords: list[str]) -> str:
    """
    Fetches and searches Mayo Clinic for a health topic, returning relevant info.
    Args:
        topic (str): The health topic to search for (e.g., 'heart rate').
        keywords (list[str]): Keywords to extract from the page.
    Returns:
        str: Relevant sentences from the Mayo Clinic page.
    """
    # Mayo Clinic topic URLs are typically https://www.mayoclinic.org/diseases-conditions/<topic>/symptoms-causes/syc-20373191
    # We'll use a search page for broader coverage
    import urllib.parse
    search_url = f"https://www.mayoclinic.org/search/search-results?q={urllib.parse.quote(topic)}"
    search_text = fetch_webpage_text(search_url)
    # Optionally, you could parse the first result and fetch that page for more detail
    return search_text_for_keywords(search_text, keywords)

def get_cdc_info(topic: str, keywords: list[str]) -> str:
    """
    Fetches and searches CDC.gov for a health topic, returning relevant info.
    Args:
        topic (str): The health topic to search for (e.g., 'heart rate').
        keywords (list[str]): Keywords to extract from the page.
    Returns:
        str: Relevant sentences from the CDC page.
    """
    import urllib.parse
    search_url = f"https://www.cdc.gov/search/index.html?query={urllib.parse.quote(topic)}"
    search_text = fetch_webpage_text(search_url)
    return search_text_for_keywords(search_text, keywords)
