from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import requests
import json
from django.conf import settings
import os
import redis
from django.views.decorators.csrf import csrf_exempt

'''
REDIS STRUCTURE
user_id_1: {
	conversation_id_1: mockChatHistory1,
	conversation_id_2: mockChatHistory2,
}
user_id_2: {
	conversation_id_1: mockChatHistory3,
}
'''
redis_client = redis.Redis.from_url(settings.REDIS_URL)

def process_chat_message(message, user_id, conversation_id):
	return {
		"status": "success",
		"message": f"Processed message: {message}",
		"user_id": user_id,
		"conversation_id": conversation_id
	}

# Create your views here.
def index(request):
	context = {}
	return render(request, 'index.html', context)

@csrf_exempt
def chat(request):
	if request.method == "POST":
		data = json.loads(request.body)
		message = data.get("message")
		user_id = data.get("user_id")
		conversation_id = data.get("conversation_id")

		# Process the chat message and get a response
		response = process_chat_message(message, user_id, conversation_id)

		return JsonResponse(response)

	return JsonResponse({"error": "Invalid request"}, status=400)