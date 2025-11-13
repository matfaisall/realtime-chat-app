"use client";

import { memo } from "react";
import Image from "next/image";
import { Message } from "@/types";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageBubble = memo(
  ({ message, isOwnMessage }: MessageBubbleProps) => {
    return (
      <div
        className={`flex ${
          isOwnMessage ? "justify-end" : "justify-start"
        } mb-2`}
      >
        <div
          className={`max-w-[70%] rounded-lg px-4 py-2 ${
            isOwnMessage ? "bg-[#dcf8c6] text-black" : "bg-white text-black"
          }`}
        >
          {message.imageUrl && (
            <div className="mb-2 relative w-full h-48">
              <Image
                src={message.imageUrl}
                alt="Attachment"
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 70vw, 400px"
                priority={false}
              />
            </div>
          )}

          {message.text && (
            <p className="text-sm wrap-break-word">{message.text}</p>
          )}

          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-xs text-gray-600">
              {format(message.timestamp, "HH:mm")}
            </span>
            {isOwnMessage && (
              <span className="text-gray-600">
                {message.read ? (
                  <CheckCheck className="w-4 h-4 text-blue-500" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";
