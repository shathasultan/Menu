import React from 'react';
import Svg, { Path, Ellipse, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { brandColors } from './theme';

type Variant = 'default' | 'calm' | 'apron';

export function Mascot({ variant = 'calm', size = 76 }: { variant?: Variant; size?: number }) {
  const isApron = variant === 'apron';
  const domeFill = isApron ? brandColors.sage : brandColors.accent;
  const domeShadeFill = isApron ? brandColors.sage600 : brandColors.accent600;
  const bodyStroke = isApron ? brandColors.sage300 : brandColors.accent300;
  const collarFill = isApron ? brandColors.sage200 : brandColors.accent200;
  const width = (size * 120) / 142;

  return (
    <Svg width={width} height={size} viewBox="0 0 120 142">
      <Ellipse cx={60} cy={34} rx={40} ry={10} fill={domeFill} />
      <Ellipse cx={60} cy={27} rx={27} ry={7.5} fill={domeShadeFill} />
      <Path
        d="M24 44h72l-9 70a14 14 0 0 1-14 12H47a14 14 0 0 1-14-12z"
        fill="#FDF7EE"
        stroke={bodyStroke}
        strokeWidth={2.5}
      />
      {variant === 'default' && (
        <>
          <Circle cx={41} cy={72} r={5.5} fill={brandColors.accent300} opacity={0.75} />
          <Circle cx={79} cy={72} r={5.5} fill={brandColors.accent300} opacity={0.75} />
        </>
      )}
      <Ellipse cx={50} cy={62} rx={4.6} ry={5.8} fill="#201E1D" />
      <Ellipse cx={71} cy={62} rx={4.6} ry={5.8} fill="#201E1D" />
      <Path d="M52 74q8.5 7.5 17 0" fill="none" stroke="#201E1D" strokeWidth={3.2} strokeLinecap="round" />
      <Rect x={29} y={88} width={62} height={24} rx={7} fill={collarFill} />
      {isApron ? (
        <Path
          d="M38 96h44M38 104h30"
          stroke={brandColors.sage700}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ) : (
        <SvgText
          x={60}
          y={105}
          textAnchor="middle"
          fill={brandColors.accent800}
          fontSize={14}
          fontWeight="800"
          fontFamily="Figtree_800ExtraBold"
        >
          A01
        </SvgText>
      )}
    </Svg>
  );
}
