<!-- app/pages/post/[postId]/index.vue -->

<script setup lang="ts">
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import LoadingSpinner from '@/components/customs/LoadingSpinner.vue';
import { postDetailQuery } from '@/queries/post-detail.query';
import PostCard from '@/components/customs/PostCard.vue';
import ImageLightbox from '@/components/customs/ImageLightbox.vue';
import CreateCommentModal from '@/components/customs/CreateCommentModal.vue';
import UpdatePostModal from '@/components/customs/UpdatePostModal.vue';
import ConfirmModal from "@/components/customs/ConfirmModal.vue";
import { toggleRepost } from '@/functions/toggle-repost';
import { toggleLike } from '@/functions/toggle-like';
import { toggleSave } from '@/functions/toggle-save';
import { updatePost } from '@/functions/update-post';
import { deletePost } from '@/functions/delete-post';
import { meQuery } from '@/queries/me.query';
import { createComment } from '@/functions/create-comment';
import defaultProfile from '@/assets/svgs/default-profile.svg';
import { commentsInfiniteQuery } from '~/queries/comments.infinite-query';
import CommentCard from '@/components/customs/CommentCard.vue';
import { toggleLikeComment } from '@/functions/toggle-like-comment';
import type { Comment } from '@/types/comment';
import { deleteComment } from '@/functions/delete-comment';
import { updateComment } from '@/functions/update-comment';
import UpdateCommentModal from '@/components/customs/UpdateCommentModal.vue';

const route = useRoute();
const router = useRouter();
const postId = computed(() => route.params.postId as string);
const queryClient = useQueryClient();

const { data: me } = useQuery(meQuery());

const {
  data: post,
  error: postError,
  isLoading: isPostLoading,
} = useQuery(
  postDetailQuery(postId.value),
);

const {
  data: paginatedComments,
} = useInfiniteQuery(
  commentsInfiniteQuery(postId.value)
);

const comments = computed(() => paginatedComments.value?.pages.flatMap((page) => page.data) ?? []);

const activeModal = ref<'create-comment' | 'update-post' | 'delete-post' | 'create-reply' | 'delete-comment' | 'update-comment' | null>(null);

const target = ref<{
  id: string;
  profileImageUrl: string | null,
  text: string;
  imageUrls: string[];
  parentId: string | null;
} | null>(null);

const reply = ref<Comment | null>(null);

const lightbox = ref<{ imageUrls: string[]; index: number } | null>(null);
const isLightboxOpen = ref(false);

const openLightbox = (payload: { imageUrls: string[]; index: number }) => {
  lightbox.value = payload;
  isLightboxOpen.value = true;
};

const toggleRepostMutation = useMutation({
  mutationFn: toggleRepost,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['posts', postId] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleLikeMutation = useMutation({
  mutationFn: toggleLike,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['posts', postId] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleSaveMutation = useMutation({
  mutationFn: toggleSave,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['posts', postId] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const createCommentMutation = useMutation({
  mutationFn: createComment,
  onSuccess: (data, variables) => {
    console.log(data);
    activeModal.value = null;

    const invalidations = [
      queryClient.invalidateQueries({ queryKey: ['posts', postId.value] }),
      queryClient.invalidateQueries({ queryKey: ['comments', postId.value] }),
    ];

    if (variables.replyToCommentId && target.value) {
      const parentId = target.value.parentId ?? target.value.id;

      invalidations.push(
        queryClient.invalidateQueries({ queryKey: ['replies', parentId] }),
      );
    }

    return Promise.all(invalidations);
  },
  onError: (error) => {
    console.error(error);
  },
});

const updatePostMutation = useMutation({
  mutationFn: updatePost,
  onSuccess: (data) => {
    activeModal.value = null;
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['posts', postId] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const deletePostMutation = useMutation({
  mutationFn: deletePost,
  onSuccess: (data) => {
    activeModal.value = null;
    console.log(data);
    goBack();
  },
  onError: (error) => {
    console.error(error);
  },
});

const toggleLikeCommentMutation = useMutation({
  mutationFn: toggleLikeComment,
  onSuccess: (data) => {
    console.log(data);
    queryClient.invalidateQueries({ queryKey: ['comments', postId] });
  },
  onError: (error) => {
    console.error(error);
  },
});

const deleteCommentMutation = useMutation({
  mutationFn: deleteComment,
  onSuccess: async (data) => {
    console.log(data);

    // Read before awaiting, in case target changes
    const deleted = target.value;

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['posts', postId.value] }),
      queryClient.invalidateQueries({ queryKey: ['comments', postId.value] }),
      deleted?.parentId
        ? queryClient.invalidateQueries({ queryKey: ['replies', deleted.parentId] })
        : Promise.resolve(),
    ]);

    // A deleted root comment takes its replies with it
    if (deleted && !deleted.parentId) {
      queryClient.removeQueries({ queryKey: ['replies', deleted.id] });
    }
  },
  onError: (error) => {
    console.error(error);
  },
});

const updateCommentMutation = useMutation({
  mutationFn: updateComment,
  onSuccess: (data) => {
    activeModal.value = null;
    console.log(data);
    const parentId = reply.value?.parentId;

    const invalidations = [
      queryClient.invalidateQueries({ queryKey: ['comments', postId.value] }),
    ];
    if (parentId) {
      invalidations.push(
        queryClient.invalidateQueries({ queryKey: ['replies', parentId] }),
      );
    }

    return Promise.all(invalidations);
  },
  onError: (error) => {
    console.error(error);
  },
});

const goBack = () => {
  if (window.history.state?.back) router.back();
  else navigateTo('/');
};

useHead({
  title: () => post.value
    ? `Post by @${post.value.user.username} - Bluecircle`
    : 'Post - Bluecircle',
});
</script>

<template>
  <main class="w-full min-h-screen">
    <div class="z-50 sticky top-0 flex items-center gap-x-4 p-4 border-b border-gray-700 bg-gray-900">
      <button
        class="flex justify-center items-center size-8 rounded-full cursor-pointer bg-gray-900 hover:bg-gray-700"
        @click="goBack"
      >
        <Icon name="lucide:arrow-left" class="size-5" />
      </button>

      <h1 class="text-xl font-bold">Post</h1>
    </div>

    <PostCard
      v-if="post"
      :post
      :is-clickable="false"
      @toggle-repost="(postId) => toggleRepostMutation.mutate({ postId })"
      @toggle-like="(postId) => toggleLikeMutation.mutate({ postId })"
      @toggle-save="(postId) => toggleSaveMutation.mutate({ postId })"
      @open-lightbox="openLightbox"
      @open-comment-modal="activeModal = 'create-comment'"
      @open-delete-post-modal="activeModal = 'delete-post'"
      @open-update-post-modal="activeModal = 'update-post'"
    />

    <div
      v-else-if="postError"
      class="flex items-center gap-x-4 m-4 p-4 rounded-lg bg-gray-800 text-slate-300"
    >
      <Icon name="lucide:trash-2" class="size-5 shrink-0" />
      <p class="font-semibold">Post not found</p>
    </div>

    <LoadingSpinner v-else-if="isPostLoading"/>

    <button
      v-if="me && post"
      class="flex items-center gap-x-2 w-full py-2 px-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800"
      @click="() => {
        if (!post) {
          return;
        }

        target = {
          id: post.id,
          profileImageUrl: post.user.profileImageUrl,
          text: post.text,
          imageUrls: post.imageUrls,
          parentId: null,
        };
        activeModal = 'create-comment';
      }"
    >
      <div class="shrink-0 block size-6 border border-gray-500 rounded-full overflow-hidden">
        <img
          class="size-full object-cover"
          :src="me.profileImageUrl || defaultProfile"
          width="auto"
          height="auto"
          :alt="me.fullname"
        />
      </div>

      <p class="text-sm text-gray-400">
        Write your comment
      </p>
    </button>

    <ul
      v-if="post"
      class="mb-[100vh]"
    >
      <li
        v-for="comment in comments"
        :key="comment.id"
      >
        <CommentCard
          :comment
          @toggle-like="(commentId) => toggleLikeCommentMutation.mutate({ commentId })"
          @reply-comment="(payload) => {
            if (!post) {
              return;
            }

            if (payload.reply) {
              target = {
                id: payload.reply.id,
                profileImageUrl: payload.reply.user.profileImageUrl,
                text: payload.reply.text,
                imageUrls: [],
                parentId: payload.reply.parentId,
              };
            }
            else {
              target = {
                id: payload.comment.id,
                profileImageUrl: payload.comment.user.profileImageUrl,
                text: payload.comment.text,
                imageUrls: [],
                parentId: payload.comment.parentId,
              };
            }
            activeModal = 'create-reply';
          }"
          @update-comment="(payload) => {
            if (!post) {
              return;
            }

            if (payload.reply) {
              target = {
                id: payload.comment.id,
                profileImageUrl: payload.comment.user.profileImageUrl,
                text: payload.comment.text,
                imageUrls: [],
                parentId: payload.comment.parentId,
              };
              reply = payload.reply;    
            }
            else if (!payload.comment.parentId) {
              target = {
                id: post.id,
                profileImageUrl: post.user.profileImageUrl,
                text: post.text,
                imageUrls: post.imageUrls,
                parentId: null,
              };
              reply = payload.comment;
            }

            activeModal = 'update-comment';
          }"
          @delete-comment="(payload) => {
            if (payload.reply) {
              target = {
                id: payload.reply.id,
                profileImageUrl: payload.reply.user.profileImageUrl,
                text: payload.reply.text,
                imageUrls: [],
                parentId: payload.reply.parentId,
              };        
            }
            else {
              target = {
                id: payload.comment.id,
                profileImageUrl: payload.comment.user.profileImageUrl,
                text: payload.comment.text,
                imageUrls: [],
                parentId: payload.comment.parentId,
              };
            }

            activeModal = 'delete-comment';
          }"
        />
      </li>
    </ul>
  </main>

  <ImageLightbox
    :open="isLightboxOpen"
    :image-urls="lightbox?.imageUrls ?? []"
    :initial-index="lightbox?.index ?? 0"
    @close="isLightboxOpen = false"
  />

  <CreateCommentModal
    v-if="target"
    :open="activeModal === 'create-comment'"
    :target="target"
    :is-pending="createCommentMutation.isPending.value"
    type="comment"
    @close="activeModal = null"
    @submit="(text) => {
      if (!target) {
        return;
      }

      createCommentMutation.mutate({
        postId,
        text,
      });
    }"
  />

  <CreateCommentModal
    v-if="target"
    :open="activeModal === 'create-reply'"
    :target="target"
    :is-pending="createCommentMutation.isPending.value"
    type="reply"
    @close="activeModal = null"
    @submit="(text) => {
      if (!target) {
        return;
      }

      createCommentMutation.mutate({
        postId,
        text,
        replyToCommentId: target.id,
      });
    }"
  />

  <UpdateCommentModal
    v-if="target && reply"
    :open="activeModal === 'update-comment'"
    :target="target"
    :reply="reply"
    :is-pending="updateCommentMutation.isPending.value"
    type="update"
    @close="activeModal = null"
    @submit="(text) => {
      if (!reply) {
        return;
      }

      updateCommentMutation.mutate({
        commentId: reply.id,
        text,
      });
    }"
  />

  <UpdatePostModal
    v-if="post"
    :open="activeModal === 'update-post'"
    :post
    @update:open="(open) => {
      activeModal = open ? 'update-post' : null;
    }"
    @update-post="(payload) => {
      if (!post) {
        return;
      }

      updatePostMutation.mutate({
        postId: post.id,
        ...payload,
      });
    }"
    :is-pending="updatePostMutation.isPending.value"
  />

  <ConfirmModal
    v-if="post"
    :open="activeModal === 'delete-post'"
    title="Delete this post?"
    message="If you remove this post, you won't be able to recover it."
    confirm-button-text="Delete"
    :is-pending="deletePostMutation.isPending.value"
    @update:open="activeModal = 'delete-post'"
    @confirm="() => {
      if (!post) {
        return;
      }

      deletePostMutation.mutate({
        postId: post.id,
      });
      activeModal = null;
    }"
    @cancel="() => {
      activeModal = null;
    }"
  />

  <ConfirmModal
    v-if="post"
    :open="activeModal === 'delete-comment'"
    title="Delete this comment?"
    message="If you remove this comment, you won't be able to recover it."
    confirm-button-text="Delete"
    :is-pending="deleteCommentMutation.isPending.value"
    @update:open="activeModal = 'delete-comment'"
    @confirm="() => {
      if (target) {
        deleteCommentMutation.mutate({
          commentId: target.id,
        });
      }
      activeModal = null;
    }"
    @cancel="() => {
      activeModal = null;
    }"
  />
</template>