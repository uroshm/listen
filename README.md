# Listen

Listen is a multi-purpose tool designed specifically for speech-language pathologists (SLPs). It provides an all-in-one solution for SLPs to enhance their work with clients through advanced features such as real-time speech recognition and testing, AI integration, record keeping, goal setting, goal tracking, and more.

### Quick start

To run the entire application using Docker, use the following command:
```sh
docker-compose up
```

- Note that https://github.com/uroshm/listen/blob/main/frontend/.env will need to be updated with your OpenRouter (https://openrouter.ai/) API Key. The model that is being used currently is "deepseek/deepseek-chat-v3-0324:free", but this will be changed to the user's choice in future iterations.
- Note that we are aware that the Analysis Docker container takes a while to download dependencies, this is something we are working on in https://github.com/uroshm/listen/issues/33.


### Implementation Chart
![listen v2](https://github.com/user-attachments/assets/51950b2e-3a81-46b1-9c0a-30e790cc9a8e)

