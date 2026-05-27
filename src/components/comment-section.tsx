"use client";

import { useState } from "react";
import Link from "next/link";
import { createComment } from "@/lib/actions/comments";
import { CommentRecord } from "@/lib/queries/comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";

type CommentNode = CommentRecord & {
  children: CommentNode[];
};

function buildCommentTree(flatComments: CommentRecord[]): CommentNode[] {
  const commentMap = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  // Initialize map
  flatComments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, children: [] });
  });

  // Build tree
  flatComments.forEach((comment) => {
    const node = commentMap.get(comment.id)!;
    if (comment.parent_id && commentMap.has(comment.parent_id)) {
      commentMap.get(comment.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

type CommentItemProps = {
  comment: CommentNode;
  promptId: string;
  replyingTo: string | null;
  onReply: (id: string | null) => void;
  depth?: number;
};

function CommentItem({ comment, promptId, replyingTo, onReply, depth = 0 }: CommentItemProps) {
  const isReplying = replyingTo === comment.id;
  
  return (
    <div className={`mt-4 ${depth > 0 ? 'ml-2 sm:ml-8 pl-4 border-l-4 border-black' : ''}`}>
      <div className="bg-white border-4 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
        <div className="flex items-start gap-3 sm:gap-4">
          <Link href={`/profile/${comment.profiles?.username}`}>
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-black rounded-none flex-shrink-0 hover:opacity-80 transition-opacity">
              <AvatarImage src={comment.profiles?.avatar_url ?? ""} />
              <AvatarFallback className="bg-neutral-200 rounded-none font-display font-black text-xs">
                {(comment.profiles?.display_name || comment.profiles?.username || "U").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="space-y-1 w-full min-w-0">
            <div className="flex flex-wrap gap-2 justify-between items-center w-full">
              <Link href={`/profile/${comment.profiles?.username}`} className="hover:underline">
                <p className="font-display font-black text-xs uppercase tracking-wider text-black truncate">
                  {comment.profiles?.display_name || comment.profiles?.username}
                </p>
              </Link>
              <p className="font-mono text-[9px] text-neutral-500 font-bold uppercase flex-shrink-0">
                {new Date(comment.created_at).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <p className="font-sans text-sm text-neutral-800 leading-relaxed pt-1 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
            
            <div className="pt-2">
              <button 
                onClick={() => onReply(isReplying ? null : comment.id)}
                className="font-mono text-[10px] font-bold uppercase hover:underline text-black active:text-neutral-500"
              >
                {isReplying ? "Cancel Reply" : "Reply"}
              </button>
            </div>
          </div>
        </div>
        
        {isReplying && (
          <form 
            action={(formData) => {
              createComment(formData);
              onReply(null);
            }} 
            className="mt-4 ml-0 sm:ml-12 space-y-3"
          >
            <input type="hidden" name="promptId" value={promptId} />
            <input type="hidden" name="parentId" value={comment.id} />
            <Textarea
              name="content"
              rows={2}
              autoFocus
              placeholder="Write a reply..."
              className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:border-black font-sans resize-none text-sm"
            />
            <SubmitButton 
              label="Post Reply" 
              pendingLabel="Posting..." 
              className="py-2 px-4 bg-black text-white font-display font-black uppercase text-[10px] tracking-wider border-2 border-black hover:bg-neutral-800 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-px"
            />
          </form>
        )}
      </div>

      {comment.children.length > 0 && (
        <div className="space-y-0">
          {comment.children.map((child) => (
            <CommentItem 
              key={child.id} 
              comment={child} 
              promptId={promptId} 
              replyingTo={replyingTo}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type CommentSectionProps = {
  promptId: string;
  comments: CommentRecord[];
};

export function CommentSection({ promptId, comments }: CommentSectionProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  const tree = buildCommentTree(comments);

  return (
    <div className="space-y-8">
      {/* Top-level comment form */}
      <div className="bg-[#f0f0f0] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
        <h3 className="font-display font-black text-xl uppercase tracking-wide mb-4">Ask how they used it</h3>
        <form 
          action={async (formData) => {
            await createComment(formData);
            const formElement = document.getElementById("main-comment-form") as HTMLFormElement;
            if (formElement) formElement.reset();
          }} 
          id="main-comment-form"
          className="space-y-4"
        >
          <input type="hidden" name="promptId" value={promptId} />
          <Textarea
            name="content"
            rows={3}
            placeholder="Drop your question, tweak, or remix idea..."
            className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:border-black font-sans resize-none"
          />
          <SubmitButton 
            label="Post Comment" 
            pendingLabel="Posting..." 
            className="py-3 px-6 bg-black text-white hover:bg-neutral-800 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] font-display font-black uppercase text-xs tracking-wider transition-all active:translate-y-px"
          />
        </form>
      </div>

      {/* Comment Tree */}
      <div className="pt-2">
        {tree.length === 0 ? (
          <p className="font-mono text-sm text-neutral-600 uppercase font-bold text-center border-2 border-dashed border-neutral-300 p-8">
            No comments yet. Ask the first question.
          </p>
        ) : (
          <div className="space-y-2">
            {tree.map((node) => (
              <CommentItem 
                key={node.id} 
                comment={node} 
                promptId={promptId}
                replyingTo={replyingTo}
                onReply={setReplyingTo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
