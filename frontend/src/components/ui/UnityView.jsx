import React from 'react';
import Unity, { useUnityContext } from 'react-unity-webgl';

export default function UnityView() {
  const { unityProvider } = useUnityContext({
    loaderUrl: '/build/Build.loader.js',
    dataUrl: '/build/Build.data',
    frameworkUrl: '/build/Build.framework.js',
    codeUrl: '/build/Build.wasm',
  });
  return <Unity unityProvider={unityProvider} />;
}