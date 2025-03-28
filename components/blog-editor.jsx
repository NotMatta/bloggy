"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from 'react-markdown';

const MarkdownDisplay = ({ markdown }) => {
  return <ReactMarkdown>{markdown}</ReactMarkdown>;
}

export const BlogEditor = ({value:{content,setContent}}) => {

  return(
    <Tabs defaultValue="editor" className="w-full h-0 flex-grow flex flex-col">
      <TabsList className="w-full">
        <TabsTrigger value="editor" className="w-1/2">Editor</TabsTrigger>
        <TabsTrigger value="preview" className="w-1/2">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="editor" className="h-0 flex-grow max-h-full overflow-scroll">
        <Textarea className="w-full h-full min-h-full border-none focus-visible:ring-0" value={content} onChange={e => setContent(e.target.value)} placeholder="Start typing your blog here..."/>
      </TabsContent>
      <TabsContent value="preview" className="markdown h-0 flex-grow max-h-full overflow-scroll">
        <MarkdownDisplay markdown={content || "Nothing to display here :)"}/>
      </TabsContent>
    </Tabs>
  )
}
