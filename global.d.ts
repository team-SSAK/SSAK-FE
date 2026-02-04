/// <reference types="react-native" />
// Allow Tailwind `className` on React Native components for NativeWind
import "nativewind/types";

// NOTE: removed react-native augmentation because it interfered with type resolution.

declare module "*.svg" {
  import * as React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
