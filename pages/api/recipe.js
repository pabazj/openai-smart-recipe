import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY
})

const openai = new OpenAIApi(configuration)

export default async function handler(req, res) {
  try {
    const { input, instructions } = req.body
    console.log('input', input, '.instructions', instructions)

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Write a recipe based on these ingredients and instructions: '${input}.'\n\nThis is the ${instructions}.`,
      temperature: 0.85,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    const suggestion = response.data?.choices?.[0].text

    if (suggestion === undefined) throw new Error('No suggestion found')

    res.status(200).json({ result: suggestion })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

