// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({pokemon: null, status: 'idle'})

  React.useEffect(() => {
    if (!pokemonName) return
    // This is to enable the loading state when switching between different pokemon
    setState({pokemon: null, status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({pokemon: pokemonData, status: 'resolved'})
      },
      error => {
        setState(s => ({...s, status: 'rejected'}))
      },
    )
  }, [pokemonName])

  if (state.status === 'rejected') throw new Error('404 Not Found')

  return !pokemonName ? (
    'Submit a pokemon'
  ) : pokemonName && !state.pokemon ? (
    <PokemonInfoFallback name={pokemonName} />
  ) : (
    <PokemonDataView pokemon={state.pokemon} />
  )
}

// class ErrorBoundary extends React.Component {
//   state = {hasError: false}

//   static getDerivedStateFromError() {
//     return {hasError: true}
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error(error, errorInfo)
//   }

//   render() {
//     if (this.state.hasError)
//       return (
//         <div role="alert">
//           There was an error:{' '}
//           <pre style={{whiteSpace: 'normal'}}>{'Something went wrong'}</pre>
//         </div>
//       )
//     return this.props.children
//   }
// }

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          resetKeys={[pokemonName]}
          onReset={() => setPokemonName('')}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
