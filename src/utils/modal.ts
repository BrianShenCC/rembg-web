import { env } from "@xenova/transformers";

import { AutoModel, AutoProcessor } from "@xenova/transformers";

const version = "2.16.1";

// Since we will download the model from the Hugging Face Hub, we can skip the local model check
env.allowLocalModels = false;
const wasmPath = `https://jsd.onmicrosoft.cn/npm/@xenova/transformers@${version}/dist/ort-wasm-simd.wasm`;
// const absoluteWasmPath = new URL(wasmPath, location.origin).href;
env.backends.onnx.wasm.wasmPaths = {
  "ort-wasm-simd.wasm": wasmPath,
};
// Proxy the WASM backend to prevent the UI from freezing
env.backends.onnx.wasm.proxy = true;

export type ModelType = "briaai/RMBG-1.4";
const modelType: ModelType = "briaai/RMBG-1.4";

// async function loadModel(modelType: modelType): Promise<ArrayBuffer> {
//   return (await localforage.getItem(getModel(modelType).name)) as ArrayBuffer;
// }

export function loadModel() {
  return AutoModel.from_pretrained(modelType, {
    // Do not require config.json to be present in the repository
    config: { model_type: "custom" },
  });
}

export function loadProcessor() {
  return AutoProcessor.from_pretrained(modelType, {
    // Do not require config.json to be present in the repository
    config: {
      do_normalize: true,
      do_pad: false,
      do_rescale: true,
      do_resize: true,
      image_mean: [0.5, 0.5, 0.5],
      feature_extractor_type: "ImageFeatureExtractor",
      image_std: [1, 1, 1],
      resample: 2,
      rescale_factor: 0.00392156862745098,
      size: { width: 1024, height: 1024 },
    },
  });
}
