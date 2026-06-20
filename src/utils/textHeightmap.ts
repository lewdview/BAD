export interface TextHeightmapResult {
  canvas: HTMLCanvasElement;
  heightmap: Uint8Array;
  width: number;
  height: number;
}

export const generateTextHeightmap = (
  text: string = '',
  fontSize: number = 44,
  textYOffset: number = 0.5, // 0.0 to 1.0 (vertical position along texture space)
  fontFamily: string = '"Arial Black", Impact, sans-serif'
): TextHeightmapResult => {
  const width = 512;
  const height = 128;
  
  // Use HTMLCanvasElement offscreen
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return {
      canvas,
      heightmap: new Uint8Array(width * height),
      width,
      height
    };
  }

  // Clear to black (0 intensity = no displacement)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  const cleanText = (text || '').trim();
  if (cleanText) {
    ctx.fillStyle = '#ffffff'; // White text (255 intensity = max displacement)
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Position text: X centered (256), Y based on offset
    const yPos = textYOffset * height;
    ctx.fillText(cleanText.toUpperCase(), width / 2, yPos);
  }

  // Read pixel values
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const heightmap = new Uint8Array(width * height);

  // Extract grayscale intensity (red channel is sufficient for grayscale)
  for (let i = 0; i < width * height; i++) {
    heightmap[i] = data[i * 4];
  }

  return {
    canvas,
    heightmap,
    width,
    height
  };
};
