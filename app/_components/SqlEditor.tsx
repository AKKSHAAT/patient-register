  import Editor from 'react-simple-code-editor'
  import React, {Dispatch, SetStateAction, useEffect} from 'react'
  import Prism from 'prismjs'

  import 'prismjs/components/prism-sql'
  import 'prismjs/themes/prism.css' 

  interface SqlEditorProps {
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    executeQuery: () => Promise<void>;
  }

  const SqlEditor = ({ query, setQuery, executeQuery }: SqlEditorProps) => {

    useEffect(() => {
      console.log('Code changed:', query)
    }, [query])

    return (
      <div className='w-full mx-auto bg-white p-4 rounded-lg shadow-md'>
        <h4 className='text-xl font-medium mb-4'>SQL Query</h4>
        <Editor
          value={query}
          onValueChange={setQuery}
          highlight={code => Prism.highlight(code, Prism.languages.sql, 'sql')}
          padding={10}
          className="font-mono text-lg font-medium rounded-lg border-2 border-gray-300 min-h-[200px] whitespace-pre-wrap focus:outline-none"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={executeQuery}
            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            Execute Query
          </button>
        </div>
      </div>
    )
  }

  export default SqlEditor