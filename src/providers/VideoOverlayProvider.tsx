"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ReportContentModal } from "@/components/ReportContentModal";
import { VideoCommentsModal } from "@/components/VideoCommentsModal";
import type { VideoChannel } from "@/lib/types";

type CommentsPreview = {
  thumbnailUrl: string;
  videoUrl?: string;
  videoOwnerId?: string | null;
  channel?: VideoChannel | null;
  hashtags?: string[];
};

export type CommentsOverlaySession = {
  videoId: string;
  title: string;
  preview: CommentsPreview;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  liked: boolean;
  loadingLike: boolean;
  onLike: () => void;
  onShare: () => void;
  onCommentsCountChange: (count: number) => void;
};

type CommentsOverlayInput = CommentsOverlaySession;

type ReportOverlaySession = {
  videoId: string;
  title: string;
};

type VideoOverlayContextValue = {
  openComments: (session: CommentsOverlayInput) => void;
  openReport: (session: ReportOverlaySession) => void;
  closeComments: () => void;
  closeReport: () => void;
  syncCommentsSession: (
    videoId: string,
    patch: Partial<
      Pick<
        CommentsOverlaySession,
        "likesCount" | "commentsCount" | "sharesCount" | "liked" | "loadingLike"
      >
    >,
  ) => void;
  commentsVideoId: string | null;
};

const VideoOverlayContext = createContext<VideoOverlayContextValue | null>(null);

export function VideoOverlayProvider({ children }: { children: ReactNode }) {
  const [commentsSession, setCommentsSession] = useState<CommentsOverlaySession | null>(null);
  const [reportSession, setReportSession] = useState<ReportOverlaySession | null>(null);

  const openComments = useCallback((session: CommentsOverlayInput) => {
    setReportSession(null);
    setCommentsSession(session);
  }, []);

  const openReport = useCallback((session: ReportOverlaySession) => {
    setCommentsSession(null);
    setReportSession(session);
  }, []);

  const closeComments = useCallback(() => {
    setCommentsSession(null);
  }, []);

  const closeReport = useCallback(() => {
    setReportSession(null);
  }, []);

  const syncCommentsSession = useCallback(
    (
      videoId: string,
      patch: Partial<
        Pick<
          CommentsOverlaySession,
          "likesCount" | "commentsCount" | "sharesCount" | "liked" | "loadingLike"
        >
      >,
    ) => {
      setCommentsSession((current) => {
        if (!current || current.videoId !== videoId) return current;
        return { ...current, ...patch };
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      openComments,
      openReport,
      closeComments,
      closeReport,
      syncCommentsSession,
      commentsVideoId: commentsSession?.videoId ?? null,
    }),
    [
      openComments,
      openReport,
      closeComments,
      closeReport,
      syncCommentsSession,
      commentsSession?.videoId,
    ],
  );

  return (
    <VideoOverlayContext.Provider value={value}>
      {children}

      {commentsSession ? (
        <VideoCommentsModal
          open
          onClose={closeComments}
          videoId={commentsSession.videoId}
          title={commentsSession.title}
          thumbnailUrl={commentsSession.preview.thumbnailUrl}
          videoUrl={commentsSession.preview.videoUrl}
          videoOwnerId={commentsSession.preview.videoOwnerId}
          channel={commentsSession.preview.channel}
          hashtags={commentsSession.preview.hashtags}
          likesCount={commentsSession.likesCount}
          commentsCount={commentsSession.commentsCount}
          sharesCount={commentsSession.sharesCount}
          liked={commentsSession.liked}
          loadingLike={commentsSession.loadingLike}
          onLike={commentsSession.onLike}
          onShare={commentsSession.onShare}
          onCommentsCountChange={commentsSession.onCommentsCountChange}
        />
      ) : null}

      {reportSession ? (
        <ReportContentModal
          open
          onClose={closeReport}
          videoId={reportSession.videoId}
          videoTitle={reportSession.title}
        />
      ) : null}
    </VideoOverlayContext.Provider>
  );
}

export function useVideoOverlay() {
  const context = useContext(VideoOverlayContext);
  if (!context) {
    throw new Error("useVideoOverlay must be used within VideoOverlayProvider");
  }
  return context;
}
