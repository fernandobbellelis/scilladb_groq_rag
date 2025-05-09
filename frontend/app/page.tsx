"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import {
  ChatMessage,
  getChatHistory,
  resetChatHistory,
  Role,
  sendChatMessage,
  type Message,
} from "@/lib/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ChatInterface() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
    data: historyData,
    isLoading: isLoadingHistory,
    isError: isHistoryError,
    error: historyError,
  } = useQuery({
    queryKey: ["chatHistory"],
    queryFn: getChatHistory,
  });

  const messages = (historyData?.history || []).map((message: Message) => ({
    ...message,
    timestamp: message.timestamp || new Date().toLocaleTimeString(),
  }));

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: sendChatMessage,
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: ["chatHistory"] });

      const previousMessages = queryClient.getQueryData(["chatHistory"]);

      const userMessage: Message = {
        role: Role.USER,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };

      queryClient.setQueryData(["chatHistory"], (old: any) => ({
        history: [...(old?.history || []), userMessage],
      }));

      return { previousMessages };
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        content: data.reply,
        role: Role.ASSISTANT,
        timestamp: new Date().toLocaleTimeString(),
      };

      queryClient.setQueryData(["chatHistory"], (old: any) => ({
        history: [...(old?.history || []), assistantMessage],
      }));
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["chatHistory"], context?.previousMessages);

      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Falha ao enviar mensagem",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
  });

  const { mutate: resetChat, isPending: isResetting } = useMutation({
    mutationFn: resetChatHistory,
    onSuccess: () => {
      queryClient.setQueryData(["chatHistory"], { history: [] });

      toast({
        title: "Sucesso",
        description: "Histórico de chat foi resetado",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Falha ao resetar histórico",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    sendMessage(input.trim());
    setInput("");
  };

  useEffect(() => {
    if (isHistoryError && historyError) {
      toast({
        title: "Erro ao carregar histórico",
        description:
          historyError instanceof Error
            ? historyError.message
            : "Falha ao carregar histórico de chat",
        variant: "destructive",
      });
    }
  }, [isHistoryError, historyError, toast]);

  const isLoading = isLoadingHistory || isSending || isResetting;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-3xl shadow-xl border-blue-200">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">
              Groq Chat Assistant
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => resetChat()}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Chat
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
            {isLoadingHistory ? (
              <div className="flex justify-center items-center h-full">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : !messages.length ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <div className="bg-blue-100 p-6 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Comece uma conversa
                </h3>
                <p className="max-w-sm">
                  Envie uma mensagem para iniciar uma conversa com o assistente
                  Groq.
                </p>
              </div>
            ) : (
              messages.map((message: ChatMessage, index: number) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === Role.USER ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] ${
                      message.role === Role.USER
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <Avatar
                      className={`h-8 w-8 ${
                        message.role === Role.USER ? "ml-2" : "mr-2"
                      } ${
                        message.role === Role.USER
                          ? "bg-blue-600"
                          : "bg-gray-400"
                      }`}
                    >
                      <div className="w-full flex items-center justify-center font-bold">
                        {message.role === Role.USER ? "U" : "AI"}
                      </div>
                    </Avatar>

                    <div
                      className={`flex flex-col ${
                        message.role === Role.USER ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === Role.USER
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-gray-100 text-gray-800 rounded-tl-none"
                        }`}
                      >
                        {message.content}
                      </div>

                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isSending && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%]">
                  <Avatar className="h-8 w-8 mr-2 bg-gray-600">
                    <div className="text-xs font-bold">AI</div>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <div className="p-3 rounded-lg bg-gray-100 text-gray-800 rounded-tl-none">
                      <div className="flex space-x-1">
                        <div
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="p-4">
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-grow border-blue-200 focus-visible:ring-blue-500"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !input.trim()}
            >
              {isSending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Powered by Davi & Nando 😍</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatInterface />
    </QueryClientProvider>
  );
}
