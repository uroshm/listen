# Listen.ai
**Listen.ai** is a multi-purpose platform designed for **speech-language pathologists (SLPs)** or those who want to access **free, open source speech language therapy**.
It offers an all-in-one solution to enhance client work with features like:

- Real-time speech recognition and feedback

- AI-powered tools

- Record keeping

- Goal setting and tracking

- And much more

## Quick Start
To run the full application with Docker, simply use:

```sh
docker-compose up
```

## Before you start:

- Update the frontend/.env file with your OpenRouter API key.

- The current default AI model is deepseek/deepseek-chat-v3-0324:free.
Future versions will allow users to easily choose their preferred model (issue #34).

- Please note: The Analysis Docker container may take a while to download dependencies.
We’re actively working to improve this (issue #33).


## Architecture Overview
![listen v2](https://github.com/user-attachments/assets/51950b2e-3a81-46b1-9c0a-30e790cc9a8e)


## Contributing
We welcome contributions!
Please see CONTRIBUTING.md for guidelines on how to get started.

## License
This project is licensed under the GNU General Public License v3.0.

Links
- <a href="https://openrouter.ai/">OpenRouter</a>

- <a href="https://github.com/uroshm/listen/issues">Project Issues</a>
