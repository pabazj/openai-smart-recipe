import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Chef from '../assets/chef.png';
import Error from '../assets/err.png';

export default function Home() {

  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [instructions, setInstructions] = useState('')

  useEffect(() => {
    if (input.length < 30) setError(false)
  }, [input])

  const submit = async () => {
    if (input.length > 30) return setError(true)
    setSuggestion(false)
    setLoading(true)

    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, instructions }),
      })

      const suggestion = await res.json()
      const { result } = suggestion

      setSuggestion(result.replace(/\\r\\n/g, "<br />"))

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setInput('')
    setInstructions('')
    setSuggestion('')
  }

  return (
    <>
      <Head>
        <title>Smart Recipe Creator</title>
        <meta name="description" content="Smart Recipe Creator with GPT3" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        
        <div id="wrapper">
          <div id="container">

            <section className={styles.openBook}>
              <header>
                <h1>Eat at your own risk</h1>
                <h6>Powered by GPT-3</h6>
              </header>
              <article>
                <h2 className={styles.chapterTitle}>Try your Magic Recipe</h2>
                <p>
                Do you want to try out something easy, cheap, quick, and delicious? First you'll have to choose ingredients.Then if you have any instructions don't forget to mention. And finally wait and see the magic recipe.
                </p>


                <div className={styles.contentItem}>
                  <div className={styles.contentItemWrapper}>
                    <textarea
                      rows={2}
                      cols="60"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder='Enter your ingredients here' />
                    
                    <textarea
                      rows={2}
                      cols="60"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder='Enter your instructions here' />

                    <div className={styles.buttonWrapper}>
                      <button type='button' onClick={submit} disabled={loading}>Genarate</button>
                      <button type='button' onClick={clear}>Try New</button>
                    </div>
                  </div>
                </div>

                <div className={styles.contentItem}>
                {loading &&
                  <div className={styles.panLoader}>
                    <div className={styles.loader}></div>
                    <div className={styles.panContainer}>
                      <div className={styles.pan}></div>
                      <div className={styles.handle}></div>
                    </div>
                    <div className={styles.shadow}></div>
                  </div>
                }

                {error && <div className={styles.imageContainer}><Image className={styles.image} src={Error} /></div>}
                {suggestion && <pre className={styles.resultContainer}>{suggestion}</pre>}
                {suggestion?.length === 0 && !loading && <div className={styles.imageContainer}><Image className={styles.image} src={Chef} /></div>}
                </div>
              </article>
              <footer>
                <ol id="page-numbers">
                  <li>1</li>
                  <li>2</li>
                </ol>
              </footer>
            </section>

          </div>
        </div>

      </main>
    </>
  )
}