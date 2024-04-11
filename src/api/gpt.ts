import OpenAI from 'openai'
import { StoryOptions } from '../features/story/type'
import { clog } from '../utils/common.utils'

const openAiClient = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

const togetherClient = new OpenAI({
  apiKey: import.meta.env.VITE_TOGETHER_API_KEY,
  baseURL: 'https://api.together.xyz/v1',
  dangerouslyAllowBrowser: true,
})

export enum GPTModel {
  GPT3Turbo = 'gpt-3.5-turbo',
  Mistral7BInstruct = 'mistralai/Mistral-7B-Instruct-v0.2',
  Mistral8x7BInstruct = 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  MetaLlama270bChatHF = 'meta-llama/Llama-2-70b-chat-hf',
  GoogleGemma7BInstruct = 'google/gemma-7b-it',
  QwenChat72B = 'Qwen/Qwen1.5-72B-Chat',
}

export const GPTModelList = new Map([
  [GPTModel.GPT3Turbo, 'ChatGPT 3.5 Turbo'],
  [GPTModel.Mistral7BInstruct, 'Mistral 7B Instruct'],
  [GPTModel.Mistral8x7BInstruct, 'Mistral 8x7B Instruct'],
  [GPTModel.MetaLlama270bChatHF, 'Meta LLaMA-2 Chat (70B)'],
  [GPTModel.GoogleGemma7BInstruct, 'Google Gemma Instruct (7B)'],
  [GPTModel.GoogleGemma7BInstruct, 'Google Gemma Instruct (7B)'],
  [GPTModel.QwenChat72B, 'Qwen 1.5 Chat (72B)'],
])

export enum Language {
  English = 'en',
  Russian = 'ru',
}

const getLangConfig = (lang: Language) => {
  switch (lang) {
    case Language.Russian:
      return 'Отвечай на Русском языке.'
    default:
      return 'Answer in English.'
  }
}

export const askGPT = async (options: StoryOptions) => {
  const client = options.model?.startsWith('gpt') ? openAiClient : togetherClient

  try {
    const systemMessage = `${options.systemMessage}\n${getLangConfig(options.lang || Language.English)}`

    clog('System message', systemMessage)
    clog('PROMPT', options.prompt)

    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: options.prompt || '',
        },
      ],
      model: options.model || GPTModel.Mistral8x7BInstruct,
    })

    const result = response.choices[0].message.content

    clog('ANSWER', result)

    return result
  } catch (error) {
    console.error(error)
  }
}