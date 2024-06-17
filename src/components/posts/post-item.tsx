"use client"

import React, { useState, useCallback } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { BiDotsHorizontalRounded } from "react-icons/bi"
import { AiFillLike, AiOutlineLike } from "react-icons/ai"
import { BiComment } from "react-icons/bi"
import { IoMdShareAlt } from "react-icons/io"
import Comments from "../comments"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import usePostStore from "@/store/post"
import type { User, Post as IPost } from "@prisma/client"
import { useUpdateDeleteMutation } from "@/hooks/useUpdateDeletePost"
import Image from "next/image"

export interface IPosts extends IPost {
  selectedFile: ISelectedFile[]
}

export type PostItemProps = {
  post: IPost & {
    selectedFile: ISelectedFile[]
  }
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const setIsPostOpen = usePostStore((store) => store.setIsPostOpen)
  const setCurrentPostId = usePostStore((store) => store.setCurrentPostId)
  const setSelectPost = usePostStore((store) => store.setSelectPost)
  const setIsEditing = usePostStore((store) => store.setIsEditing)

  const { deletePostMutation } = useUpdateDeleteMutation()

  console.log(post)

  const handleUpdatePost = () => {
    setIsPostOpen(true)
    setCurrentPostId(post.id)
    setSelectPost({
      id: post.id,
      content: post.content,
      selectedFile: post.selectedFile,
    })
    setIsEditing(true)
  }

  return (
    <>
      <div className="flex gap-3 p-3">
        <Link
          href={`/profile`}
          className={cn(
            "focus-visible:outline-offset-3 rounded-full ring-primary ring-offset-1 focus-visible:outline-primary focus-visible:ring-primary active:ring"
          )}
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="mr-auto flex flex-col self-center leading-none">
          <Link
            href={`/profile`}
            className={cn(
              "block rounded-full text-base font-semibold capitalize text-foreground/90",
              "ring-primary ring-offset-1 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary active:ring"
            )}
          >
            Benjo Quilario
          </Link>
          <span className="text-xs text-muted-foreground/70">4d</span>
        </div>

        <div className="self-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className={cn(
                  "rounded-full p-2 text-foreground/80 hover:bg-secondary/40 hover:text-foreground/90 active:scale-110 active:bg-secondary/30",
                  "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
                )}
                aria-label="open modal post"
              >
                <BiDotsHorizontalRounded aria-hidden="true" size={26} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  className="w-full cursor-pointer"
                  onClick={handleUpdatePost}
                >
                  Edit
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  onClick={() =>
                    deletePostMutation.mutate({
                      postId: post.id,
                    })
                  }
                  variant="ghost"
                  className="w-full cursor-pointer"
                >
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="px-3 font-normal md:px-5">
        <span className="break-words text-base">{post.content}</span>
        {post.selectedFile.length !== 0 && (
          <div
            className={cn(
              "relative grid gap-1",
              post.selectedFile.length > 1 && "!grid-cols-2"
            )}
          >
            {post.selectedFile.map((image, index) => {
              return (
                <div
                  key={index + 1}
                  className={cn(
                    "relative cursor-pointer overflow-hidden rounded",
                    post.selectedFile.length === 3 &&
                      index === 0 &&
                      "col-span-2",
                    post.selectedFile.length === 3 && index === 2 && "self-end"
                  )}
                >
                  <div
                    className="relative h-full cursor-pointer active:opacity-80"
                    tabIndex={0}
                    role="button"
                  >
                    <Image
                      src={image.url}
                      style={{ objectFit: "cover" }}
                      alt={image.url}
                      unoptimized
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between px-5">
        <div className="flex items-center gap-1 text-sm text-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded-full">
            <AiFillLike aria-hidden size={13} className="text-foreground" />
          </span>

          <span className="font-normal text-foreground/80">4</span>
        </div>
        <div className="flex gap-1 text-sm font-semibold text-muted-foreground/50">
          <span>4</span>
          <BiComment aria-hidden size={20} />
        </div>
      </div>
      <ul className="rou mx-1 mt-1 flex justify-between rounded-t-md border-t border-l-secondary/40 font-light">
        <li className="w-full flex-1 py-1">
          <Button
            type="button"
            className={cn(
              "text-muted-foreground-600 flex h-[35px] w-full items-center justify-center gap-1 rounded-md hover:bg-secondary active:scale-110",
              "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
            )}
            variant="ghost"
            aria-label="Like Post"
            // onClick={handleLikePost}
          >
            <span>
              <AiFillLike
                aria-hidden="true"
                size={21}
                className="text-primary"
              />
            </span>
            <span className={cn("text-sm font-bold text-primary")}>Like</span>
          </Button>
        </li>

        <li className="w-full flex-1 py-1">
          <Button
            // type="button"
            onClick={() => setIsCommentOpen(true)}
            variant="ghost"
            className={cn(
              "flex h-[35px] w-full items-center justify-center gap-1 text-foreground/60 hover:bg-secondary",
              "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
            )}
            aria-label="Leave a Comment"
          >
            <BiComment
              aria-hidden="true"
              size={20}
              className="text-foreground/90"
            />
            <span className="text-foreground-80 text-sm font-semibold">
              Comment
            </span>
          </Button>
        </li>
        <li className="w-full flex-1 py-1">
          <Button
            variant="ghost"
            type="button"
            aria-label="Share a post"
            className={cn(
              "flex h-[35px] w-full items-center justify-center gap-1 rounded-md text-foreground/60 hover:bg-secondary",
              "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
            )}
          >
            <IoMdShareAlt
              aria-hidden="true"
              size={20}
              className="text-foreground/90"
            />
            <span className="text-sm font-semibold text-foreground/80">
              Share
            </span>
          </Button>
        </li>
      </ul>
      {isCommentOpen && <Comments />}
    </>
  )
}

export default PostItem
