/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai'
import { ImageGenerateParams } from 'openai/resources/images.mjs'
import { StoryOptions } from '../features/story/type'
import { clog } from '../utils/common.utils'

export enum AITextModel {
  GPT3Turbo = 'gpt-3.5-turbo',

  YiChat = 'zero-one-ai/Yi-34B-Chat', // 4096
  // OLMoInstruct7B = 'allenai/OLMo-7B-Instruct', // 2048
  // OLMoTwin2T7B = 'allenai/OLMo-7B-Twin-2T', // 2048
  // OLMo7B = 'allenai/OLMo-7B', // 2048
  // ChronosHermes13B = 'Austism/chronos-hermes-13b', // 2048
  // DolphinMixtral8x7b = 'cognitivecomputations/dolphin-2.5-mixtral-8x7b', // 32768, too slow
  // DBRXInstruct = 'databricks/dbrx-instruct', // 32000
  // DeepseekCoderInstruct33B = 'deepseek-ai/deepseek-coder-33b-instruct', // 16384
  // DeepSeekLLMChat67B = 'deepseek-ai/deepseek-llm-67b-chat', // 4096
  Platypus2Instruct70B = 'garage-bAInd/Platypus2-70B-instruct', // 4096
  // GoogleGemmaInstruct2B = 'google/gemma-2b-it', // 8192
  GoogleGemma7BInstruct = 'google/gemma-7b-it', // 8192
  MythoMaxL213B = 'Gryphe/MythoMax-L2-13b', // 4096
  LMSysVicuna13B = 'lmsys/vicuna-13b-v1.5', // 4096
  LMSysVicuna7B = 'lmsys/vicuna-7b-v1.5', // 4096
  CodeLlamaInstruct13B = 'codellama/CodeLlama-13b-Instruct-hf', // 16384
  CodeLlamaInstruct34B = 'codellama/CodeLlama-34b-Instruct-hf', // 16384
  // CodeLlamaInstruct70B = 'codellama/CodeLlama-70b-Instruct-hf', // 4096
  CodeLlamaInstruct7B = 'codellama/CodeLlama-7b-Instruct-hf', // 16384
  LLaMA2Chat70B = 'meta-llama/Llama-2-70b-chat-hf', // 4096
  LLaMA2Chat13B = 'meta-llama/Llama-2-13b-chat-hf', // 4096
  LLaMA2Chat7B = 'meta-llama/Llama-2-7b-chat-hf', // 4096
  LLaMA3Chat8B = 'meta-llama/Llama-3-8b-chat-hf', // 8000
  LLaMA3Chat70B = 'meta-llama/Llama-3-70b-chat-hf', // 8000
  WizardLM2dash8x22B = 'microsoft/WizardLM-2-8x22B', // 65536
  // Mistral7BInstruct01 = 'mistralai/Mistral-7B-Instruct-v0.1', // 8192
  Mistral7BInstruct02 = 'mistralai/Mistral-7B-Instruct-v0.2', // 32768
  Mistral8x7BInstruct = 'mistralai/Mixtral-8x7B-Instruct-v0.1', // 32768
  Mixtral8x22BInstruct141B = 'mistralai/Mixtral-8x22B-Instruct-v0.1', // 65536
  NousCapybara7B = 'NousResearch/Nous-Capybara-7B-V1p9', // 8192
  NousHermes2MistralDPO7B = 'NousResearch/Nous-Hermes-2-Mistral-7B-DPO', // 32768
  NousHermes2Mistral8x7BDPO = 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO', // 32768
  NousHermes2Mistral8x7BSFT = 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-SFT', // 32768
  // NousHermesLLaMA27B = 'NousResearch/Nous-Hermes-llama-2-7b', // 4096
  NousHermesLLaMA213B = 'NousResearch/Nous-Hermes-Llama2-13b', // 4096
  NousHermes2Yi34B = 'NousResearch/Nous-Hermes-2-Yi-34B', // 4096
  OpenChat7B = 'openchat/openchat-3.5-1210', // 8192
  OpenOrcaMistral7B8K = 'Open-Orca/Mistral-7B-OpenOrca', // 8192
  // QwenChat05B = 'Qwen/Qwen1.5-0.5B-Chat', // 32768
  // QwenChat1p5B = 'Qwen/Qwen1.5-1.8B-Chat', // 32768
  // QwenChat4B = 'Qwen/Qwen1.5-4B-Chat', // 32768
  QwenChat7B = 'Qwen/Qwen1.5-7B-Chat', // 32768
  QwenChat14B = 'Qwen/Qwen1.5-14B-Chat', // 32768
  QwenChat32B = 'Qwen/Qwen1.5-32B-Chat', // 32768
  QwenChat72B = 'Qwen/Qwen1.5-72B-Chat', // 32768
  SnorkelMistralPairRMDPO7B = 'snorkelai/Snorkel-Mistral-PairRM-DPO', // 2048
  TekniumOpenHermes2Mistral7B = 'teknium/OpenHermes-2-Mistral-7B', // 8192
  TekniumOpenHermes2p5Mistral7B = 'teknium/OpenHermes-2p5-Mistral-7B', // 8192
  // TogetherLLaMA27B32KInstruct7B = 'togethercomputer/Llama-2-7B-32K-Instruct', // 32768
  // TogetherRedPajamaINCITEChat3B = 'togethercomputer/RedPajama-INCITE-Chat-3B-v1', // 2048
  // TogetherRedPajamaINCITEChat7B = 'togethercomputer/RedPajama-INCITE-7B-Chat', // 2048
  // Undi95ReMMSLERPL213B = 'Undi95/ReMM-SLERP-L2-13B', // 4096
  Undi95ToppyM7B = 'Undi95/Toppy-M-7B', // 4096
  WizardLMv1p213B = 'WizardLM/WizardLM-13B-V1.2', // 4096
  // UpstageSOLARInstructV111B = 'upstage/SOLAR-10.7B-Instruct-v1.0', // 4096
}

export const AITextModelList = new Map([
  [AITextModel.GPT3Turbo, 'ChatGPT 3.5 Turbo'],

  [AITextModel.YiChat, '01-ai Yi Chat (34B)'],
  // [AITextModel.OLMoInstruct7B, 'OLMo Instruct (7B)'],
  // [AITextModel.OLMoTwin2T7B, 'OLMo Twin-2T (7B)'],
  // [AITextModel.OLMo7B, 'OLMo (7B)'],
  // [AITextModel.ChronosHermes13B, 'Chronos Hermes (13B)'],
  // [AITextModel.DolphinMixtral8x7b, 'Dolphin 2.5 Mixtral 8x7b'],
  // [AITextModel.DBRXInstruct, 'DBRX Instruct'],
  // [AITextModel.DeepseekCoderInstruct33B, 'Deepseek Coder Instruct (33B)'],
  // [AITextModel.DeepSeekLLMChat67B, 'DeepSeek LLM Chat (67B)'],
  [AITextModel.Platypus2Instruct70B, 'Platypus2 Instruct (70B)'],
  // [AITextModel.GoogleGemmaInstruct2B, 'Google Gemma Instruct (2B)'],
  [AITextModel.GoogleGemma7BInstruct, 'Google Gemma Instruct (7B)'],
  [AITextModel.MythoMaxL213B, 'MythoMax-L2 (13B)'],
  [AITextModel.LMSysVicuna13B, 'LM Sys Vicuna v1.5 (13B)'],
  [AITextModel.LMSysVicuna7B, 'LM Sys Vicuna v1.5 (7B)'],
  [AITextModel.CodeLlamaInstruct13B, 'Meta Code Llama Instruct (13B)'],
  [AITextModel.CodeLlamaInstruct34B, 'Meta Code Llama Instruct (34B)'],
  // [AITextModel.CodeLlamaInstruct70B, 'Meta Code Llama Instruct (70B)'],
  [AITextModel.CodeLlamaInstruct7B, 'Meta Code Llama Instruct (7B)'],
  [AITextModel.LLaMA2Chat70B, 'Meta LLaMA-2 Chat (70B)'],
  [AITextModel.LLaMA2Chat13B, 'Meta LLaMA-2 Chat (13B)'],
  [AITextModel.LLaMA2Chat7B, 'Meta LLaMA-2 Chat (7B)'],
  [AITextModel.LLaMA3Chat8B, 'Meta LLaMA-3 Chat (8B)'],
  [AITextModel.LLaMA3Chat70B, 'Meta LLaMA-3 Chat (70B)'],
  [AITextModel.WizardLM2dash8x22B, 'Microsoft WizardLM-2 (8x22B)'],
  // [AITextModel.Mistral7BInstruct01, 'Mistral (7B) Instruct 0.1'],
  [AITextModel.Mistral7BInstruct02, 'Mistral (7B) Instruct 0.2'],
  [AITextModel.Mistral8x7BInstruct, 'Mistral 8x7B Instruct (46.7B)'],
  [AITextModel.Mixtral8x22BInstruct141B, 'Mixtral-8x22B Instruct (141B)'],
  [AITextModel.NousCapybara7B, 'Nous Capybara v1.9 (7B)'],
  [AITextModel.NousHermes2MistralDPO7B, 'Nous Hermes 2 - Mistral DPO (7B)'],
  [AITextModel.NousHermes2Mistral8x7BDPO, 'Nous Hermes 2 - Mistral 8x7B-DPO (46.7B)'],
  [AITextModel.NousHermes2Mistral8x7BSFT, 'Nous Hermes 2 - Mistral 8x7B-SFT (46.7B)'],
  // [AITextModel.NousHermesLLaMA27B, 'Nous Hermes LLaMA-2 (7B)'],
  [AITextModel.NousHermesLLaMA213B, 'Nous Hermes LLaMA-2 (13B)'],
  [AITextModel.NousHermes2Yi34B, 'Nous Hermes-2 Yi (34B)'],
  [AITextModel.OpenChat7B, 'OpenChat 3.5 (7B)'],
  [AITextModel.OpenOrcaMistral7B8K, 'OpenOrca Mistral (7B) 8K'],
  // [AITextModel.QwenChat05B, 'Qwen 1.5 Chat (0.5B)'],
  // [AITextModel.QwenChat1p5B, 'Qwen 1.5 Chat (1.5B)'],
  // [AITextModel.QwenChat4B, 'Qwen 1.5 Chat (4B)'],
  [AITextModel.QwenChat7B, 'Qwen 1.5 Chat (7B)'],
  [AITextModel.QwenChat14B, 'Qwen 1.5 Chat (14B)'],
  [AITextModel.QwenChat32B, 'Qwen 1.5 Chat (32B)'],
  [AITextModel.QwenChat72B, 'Qwen 1.5 Chat (72B)'],
  [AITextModel.SnorkelMistralPairRMDPO7B, 'Snorkel Mistral PairRM DPO (7B)'],
  [AITextModel.TekniumOpenHermes2Mistral7B, 'Teknium OpenHermes-2-Mistral (7B)'],
  [AITextModel.TekniumOpenHermes2p5Mistral7B, 'Teknium OpenHermes-2.5-Mistral (7B)'],
  // [AITextModel.TogetherLLaMA27B32KInstruct7B, 'Together LLaMA-2-7B-32K-Instruct (7B)'],
  // [AITextModel.TogetherRedPajamaINCITEChat3B, 'Together RedPajama-INCITE Chat (3B)'],
  // [AITextModel.TogetherRedPajamaINCITEChat7B, 'Together RedPajama-INCITE Chat (7B)'],
  // [AITextModel.Undi95ReMMSLERPL213B, 'Undi95 ReMM SLERP L2 (13B)'],
  [AITextModel.Undi95ToppyM7B, 'Undi95 Toppy M (7B)'],
  [AITextModel.WizardLMv1p213B, 'WizardLM v1.2 (13B)'],
  // [AITextModel.UpstageSOLARInstructV111B, 'Upstage SOLAR Instruct v1 (11B)'],
])

export enum AIImageModel {
  OpenAIDallE2 = 'dall-e-2',
  OpenAIDallE3 = 'dall-e-3',
  Openjourney4 = 'prompthero/openjourney',
  RunwayStableDiffusion = 'runwayml/stable-diffusion-v1-5',
  RealisticVision = 'SG161222/Realistic_Vision_V3.0_VAE',
  StableDiffusion2 = 'stabilityai/stable-diffusion-2-1',
  StableDiffusionXL = 'stabilityai/stable-diffusion-xl-base-1.0',
  AnalogDiffusion = 'wavymulder/Analog-Diffusion',
}

export const AIImageModelList = new Map([
  [AIImageModel.OpenAIDallE2, 'OpenAI DALL·E 2'],
  [AIImageModel.OpenAIDallE3, 'OpenAI DALL·E 3'],
  [AIImageModel.Openjourney4, 'Prompt Hero Openjourney v4'],
  [AIImageModel.RunwayStableDiffusion, 'Runway ML Stable Diffusion 1.5'],
  [AIImageModel.RealisticVision, 'Realistic Vision 3.0'],
  [AIImageModel.StableDiffusion2, 'Stable Diffusion 2.1'],
  [AIImageModel.StableDiffusionXL, 'Stable Diffusion XL 1.0'],
  [AIImageModel.AnalogDiffusion, 'Analog Diffusion'],
])

const TOGETHER_AI_URL = 'https://api.together.xyz/v1'

const getClient = (key: string, baseURL?: string) => {
  return new OpenAI({
    apiKey: key,
    baseURL,
    dangerouslyAllowBrowser: true,
  })
}

export enum Language {
  English = 'en',
  Russian = 'ru',
}

const getLangConfig = (lang?: string) => {
  switch (lang) {
    case Language.Russian:
      return 'Отвечай на Русском языке.'
    default:
      return 'Answer in English.'
  }
}

export const askGPT = async (options: StoryOptions, key: string) => {
  const client = options.model?.startsWith('gpt') ? getClient(key) : getClient(key, TOGETHER_AI_URL)

  try {
    const systemMessage = `${options.systemMessage}\n${getLangConfig(options.lang)}`

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
      model: options.model || AITextModel.Mistral8x7BInstruct,
    })

    const result = response.choices[0].message.content

    clog('ANSWER', result)

    return result
  } catch (error) {
    console.error(error)
  }
}

export const askGPTImage = async (options: ImageGenerateParams, key: string) => {
  const client = options.model?.startsWith('dall-e')
    ? getClient(key)
    : getClient(key, TOGETHER_AI_URL)

  try {
    const response = await client.images.generate(options)

    return response.data
  } catch (error: any) {
    console.error(error.message)
    throw new Error(error.message)
  }
}
