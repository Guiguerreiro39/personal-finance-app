import { PostService } from "@/features/post/service";
import { Layer, ManagedRuntime } from "effect";

const MainLayer = Layer.mergeAll(PostService.Default);

export const RuntimeServer = ManagedRuntime.make(MainLayer);
