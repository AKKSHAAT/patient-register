import Editor from 'react-simple-code-editor'
import React, {Dispatch, SetStateAction, useEffect} from 'react'
import Prism from 'prismjs'

import 'prismjs/components/prism-sql'
import 'prismjs/themes/prism.css' 

const SqlEditor = ({query, setQuery} : {query: string, setQuery: Dispatch<SetStateAction<string>>}) => {

  useEffect(() => {
    console.log('Code changed:', query)
  }, [query])

  return (
    <Editor
      value={query}
      onValueChange={setQuery}
      highlight={code => Prism.highlight(code, Prism.languages.sql, 'sql')}
      padding={10}
      className="font-mono text-sm rounded-lg border border-gray-300 min-h-[200px] w-[75vw] whitespace-pre-wrap focus:outline-none"
    />
  )
}

export default SqlEditor