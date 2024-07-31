"use client";

import { PublishPost } from "@/actions/post/create-post";
import { protectedPostConfig } from "@/config/protected";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 as SpinnerIcon } from "lucide-react";

// Define the props for PostEditButton
interface PostEditButtonProps {
  id: string;
  title: string;
  content: string;
}

const PostEditButton: React.FC<PostEditButtonProps> = ({ id, title, content }) => {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);

  // Check authentication and session state
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  async function publishMyPost() {
    setIsLoading(true);

    if (id && session?.user.id) {
      const myPostData = {
        id,
        title,
        content,
        published: true,
        user_id: session.user.id,
      };

      const response = await PublishPost(myPostData);
      if (response) {
        setIsLoading(false);
        toast.success(protectedPostConfig.successPostPublished);
        router.refresh();
      } else {
        setIsLoading(false);
        toast.error(protectedPostConfig.errorUpdate);
      }
    } else {
      setIsLoading(false);
      toast.error(protectedPostConfig.errorUpdate);
    }
  }

  return (
    <button
      type="button"
      onClick={publishMyPost}
      className="flex items-center rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
    >
      {isLoading && <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />}
      {protectedPostConfig.publishPost}
    </button>
  );
};

export default PostEditButton;
