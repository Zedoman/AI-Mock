import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { Play, Save, RotateCcw, Send } from "lucide-react";

interface CodeEditorProps {
  code?: string;
  language?: string;
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  onRun?: () => void;
  onSubmit?: () => void;
  onReset?: () => void;
  onSave?: () => void;
  consoleOutput?: string[];
  isSubmitting?: boolean;
}

const CodeEditor = ({
  code,
  language = "javascript",
  onCodeChange = () => {},
  onLanguageChange = () => {},
  onRun = () => {},
  onSubmit = () => {},
  onReset = () => {},
  onSave = () => {},
  consoleOutput = [],
  isSubmitting = false,
}: CodeEditorProps) => {
  // Set default code based on language
  const getDefaultCode = (lang: string) => {
    switch (lang) {
      case "javascript":
        return "// Write your code here\n";
      case "python":
        return "# Write your code here\n";
      case "java":
        return "// Write your code here\n";
      default:
        return "// Write your code here\n";
    }
  };

  // State to manage the height of the console output
  const [consoleHeight, setConsoleHeight] = useState(128); // Default height in pixels (equivalent to h-32)
  const minConsoleHeight = 100; // Minimum height for console output
  const maxConsoleHeight = 400; // Maximum height for console output
  const isDragging = useRef(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on the divider to start dragging
  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = "ns-resize"; // Change cursor to resize
  };

  // Handle mouse move to resize the console output
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !editorContainerRef.current) return;

    const containerRect = editorContainerRef.current.getBoundingClientRect();
    const newHeight = containerRect.bottom - e.clientY; // Calculate new height based on mouse position

    // Constrain the height within min and max limits
    if (newHeight >= minConsoleHeight && newHeight <= maxConsoleHeight) {
      setConsoleHeight(newHeight);
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "default"; // Reset cursor
  };

  // Add event listeners for mouse move and mouse up
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-background border border-border rounded-md overflow-hidden">
      {/* Header with language selector and buttons */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-muted">
        <div className="flex items-center space-x-2">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onReset} title="Reset code">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={onSave} title="Save code">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting}
            title="Submit code"
          >
            <Send className="h-4 w-4 mr-1" />
            Submit
          </Button>
        </div>
      </div>

      {/* Main content area with resizable sections */}
      <div className="flex flex-col flex-grow overflow-hidden" ref={editorContainerRef}>
        {/* Code editor (textarea) - takes remaining space */}
        <div className="flex-grow overflow-hidden">
          <textarea
            value={code || getDefaultCode(language)}
            onChange={(e) => onCodeChange(e.target.value)}
            className={cn(
              "w-full h-full p-4 font-mono text-sm resize-none focus:outline-none",
              "bg-background text-foreground"
            )}
            spellCheck="false"
            placeholder="Write your code here..."
          />
        </div>

        {/* Draggable divider */}
        <div
          className="h-1 bg-gray-300 cursor-ns-resize hover:bg-gray-400 transition-colors"
          onMouseDown={handleMouseDown}
        />

        {/* Console output with dynamic height */}
        <div
          className="border-t border-border flex flex-col"
          style={{ height: `${consoleHeight}px` }}
        >
          <div className="p-2 bg-muted text-sm font-medium">Console Output</div>
          <div className="flex-grow overflow-auto p-2 font-mono text-sm bg-black text-white">
            {consoleOutput.length > 0 ? (
              consoleOutput.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))
            ) : (
              <div className="text-gray-400 italic">
                Run your code to see output
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;