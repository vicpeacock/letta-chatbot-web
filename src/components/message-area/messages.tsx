import { useEffect, useMemo, useRef } from 'react'
import { MessagePill } from '@/components/ui/message'
import { Ellipsis, LoaderCircle } from 'lucide-react'
import { MessagePopover } from './message-popover'
import { DEFAULT_BOT_MESSAGE, ERROR_CONNECTING } from '@/app/lib/labels'
import { useIsConnected } from '../hooks/use-is-connected'
import { useAgents } from '../hooks/use-agents'
import { ReasoningMessageBlock } from '@/components/ui/reasoning-message'
import { useReasoningMessage } from '@/components/toggle-reasoning-messages'
import type { UseChatHelpers } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { ToolCallMessageBlock } from '@/components/ui/tool-call-message'

interface MessagesProps {
  messages: UIMessage[]
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  sendMessage: (message: { text: string }) => void
}

export const Messages = (props: MessagesProps) => {
  const { messages, status, sendMessage } = props
  const { isEnabled } = useReasoningMessage()
  const { data: agents } = useAgents()

  const messagesListRef = useRef<HTMLDivElement>(null)
  const isConnected = useIsConnected()

  const isSendingMessage = status === 'submitted' || status === 'streaming'

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // scroll to the bottom on first render and when messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const showPopover = useMemo(() => {
    if (!messages) {
      return false
    }

    const firstReasoningPart = messages[0]?.parts?.find(
      (part) => part.type === 'reasoning' && 'reasoning' in part
    ) as { reasoning?: string } | undefined

    return (
      messages.length === 2 &&
      firstReasoningPart?.reasoning === DEFAULT_BOT_MESSAGE
    )
  }, [messages])

  return (
    <div ref={messagesListRef} className='flex-1 overflow-y-auto'>
      <div className='group/message mx-auto w-full max-w-3xl px-4 h-full'>
        <div className='flex h-full'>
          {messages ? (
            showPopover ? (
              <MessagePopover key={messages[0].id} sendMessage={sendMessage} />
            ) : (
              <div
                className='flex min-w-0 flex-1 flex-col gap-6 pt-4'
                key='messages-list'
              >
                {messages.map((message: UIMessage) => {
                  const reasoningPart = message.parts?.find(
                    (part) => part.type === 'reasoning'
                  )
                  const toolCallPart = message.parts?.find((part) =>
                    part.type.includes('tool-')
                  )

                  return (
                    <div key={message.id}>
                      {toolCallPart && (
                        <ToolCallMessageBlock
                          key={message.id + '_' + toolCallPart.type}
                          message={toolCallPart.type}
                          isEnabled={isEnabled}
                        />
                      )}

                      {reasoningPart && reasoningPart.type === 'reasoning' && (
                        <ReasoningMessageBlock
                          data-id={message.id + '_' + reasoningPart.type}
                          key={message.id + '_' + reasoningPart.type}
                          message={reasoningPart.text}
                          isEnabled={isEnabled}
                        />
                      )}

                      {message.parts?.map((part, partIndex) => {
                        if (part.type === 'text') {
                          return (
                            <MessagePill
                              data-id={
                                message.id +
                                '_' +
                                message.role +
                                '_' +
                                partIndex
                              }
                              key={
                                message.id +
                                '_' +
                                message.role +
                                '_' +
                                partIndex
                              }
                              message={part.text}
                              sender={message.role}
                            />
                          )
                        }
                        return null
                      })}
                    </div>
                  )
                })}

                {isSendingMessage && (
                  <div className='flex justify-start'>
                    <Ellipsis size={24} className='animate-pulse' />
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )
          ) : (
            <div className='flex min-w-0 flex-1 flex-col justify-center items-center h-full'>
              {status === 'ready' ||
              (isConnected && agents && agents.length === 0) ? (
                <LoaderCircle className='animate-spin' size={32} />
              ) : (
                ERROR_CONNECTING
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
