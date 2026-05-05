import { Composition } from "remotion";
import { TributeVideo } from "./TributeVideo";

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="NitinTributeLandscape"
        component={TributeVideo}
        durationInFrames={2040}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ format: "landscape" as const }}
      />
      <Composition
        id="NitinTributeStory"
        component={TributeVideo}
        durationInFrames={2040}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ format: "story" as const }}
      />
    </>
  );
}
