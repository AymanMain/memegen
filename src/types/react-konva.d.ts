import React from 'react';
import type { Node, NodeConfig } from 'konva/lib/Node';

declare module 'react-konva' {
  // Base types
  export interface KonvaEventObject<T> {
    target: Node;
    currentTarget: Node;
    evt: T;
    cancelBubble: boolean;
    preventDefault(): void;
    stopPropagation(): void;
  }

  export interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
  }

  // Stage types
  export interface StageProps extends NodeConfig {
    width: number;
    height: number;
    onMouseDown?: (e: KonvaEventObject<MouseEvent>) => void;
    onMouseMove?: (e: KonvaEventObject<MouseEvent>) => void;
    onMouseUp?: (e: KonvaEventObject<MouseEvent>) => void;
    onTouchStart?: (e: KonvaEventObject<TouchEvent>) => void;
    onTouchMove?: (e: KonvaEventObject<TouchEvent>) => void;
    onTouchEnd?: (e: KonvaEventObject<TouchEvent>) => void;
    ref?: React.Ref<Stage>;
  }

  // Transformer types
  export interface TransformerProps extends NodeConfig {
    boundBoxFunc?: (oldBox: Box, newBox: Box) => Box;
    enabledAnchors?: string[];
    padding?: number;
    keepRatio?: boolean;
    centeredScaling?: boolean;
    rotationSnaps?: number[];
    rotationSnapTolerance?: number;
    ref?: React.Ref<Transformer>;
  }

  // Stage component
  export class Stage extends React.Component<StageProps> {
    getStage(): Node;
    toDataURL(config?: {
      pixelRatio?: number;
      mimeType?: string;
      quality?: number;
      width?: number;
      height?: number;
      x?: number;
      y?: number;
    }): string;
    findOne(selector: string): Node | undefined;
    getPointerPosition(): { x: number; y: number } | null;
  }

  // Transformer component
  export class Transformer extends React.Component<TransformerProps> {
    getNode(): Node;
    nodes(nodes: Node[]): void;
    getLayer(): Layer;
    moveToTop(): void;
    moveToBottom(): void;
    moveUp(): void;
    moveDown(): void;
  }

  // Layer component
  export class Layer extends React.Component<NodeConfig> {
    getLayer(): Layer;
    batchDraw(): void;
  }

  // Text component
  export interface TextProps extends NodeConfig {
    text: string;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    draggable?: boolean;
    onDblClick?: (e: KonvaEventObject<MouseEvent>) => void;
    onDragEnd?: (e: KonvaEventObject<DragEvent>) => void;
  }

  export class Text extends React.Component<TextProps> {
    getText(): string;
    setText(text: string): void;
  }

  // Image component
  export interface ImageProps extends NodeConfig {
    image?: HTMLImageElement;
    draggable?: boolean;
  }

  export class Image extends React.Component<ImageProps> {
    getImage(): HTMLImageElement | undefined;
    setImage(image: HTMLImageElement): void;
  }
} 