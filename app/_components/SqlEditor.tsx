  import Editor from 'react-simple-code-editor'
  import React, {Dispatch, SetStateAction} from 'react'
  import Prism from 'prismjs'

  import 'prismjs/components/prism-sql'
  import 'prismjs/themes/prism.css' 

  interface SqlEditorProps {
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    executeQuery: () => Promise<void>;
  }

  const SqlEditor = ({ query, setQuery, executeQuery }: SqlEditorProps) => {
    return (
      <div className='w-full h-full mx-auto bg-white p-4 rounded-lg shadow-md'>
        <div className='flex gap-2 items-baseline'>
          <h4 className='text-xl font-medium mb-4'>SQL Query</h4>
          <p className='text-gray-400'>(Press Ctrl + Enter To Execute Queries)</p>
        </div>
        <Editor
          value={query}
          onValueChange={setQuery}
          highlight={code => Prism.highlight(code, Prism.languages.sql, 'sql')}
          padding={10}
          className="font-mono text-lg font-medium rounded-lg border-2 border-gray-300 min-h-[200px] whitespace-pre-wrap focus:outline-none h-[80%]"
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