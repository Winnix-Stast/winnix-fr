import { Colors } from "@/presentation/styles";
import * as React from "react";
import Svg, { Circle, G, Line, Path, Rect, SvgProps } from "react-native-svg";

export const PlusIcon = (props: SvgProps) => (
  <Svg viewBox='0 0 24 24' width='100%' height='100%' {...props}>
    <Path d='M12 5V19M5 12H19' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </Svg>
);

export const EmptyTournamentIcon = (props: SvgProps) => (
  <Svg viewBox='0 0 400 400' width='100%' height='100%' {...props}>
    <Circle cx='200' cy='200' r='160' fill={Colors.brand_secondary} opacity='0.1' />
    <Circle cx='200' cy='200' r='110' fill={Colors.brand_primary} opacity='0.15' />

    <Path d='M80 100 L320 100 L280 300 C280 350 200 380 200 380 C200 380 120 350 120 300 Z' fill={Colors.surface_elevated} stroke={Colors.brand_secondary} strokeWidth='8' strokeLinejoin='round' />

    <Path d='M105 125 L295 125 L265 285 C265 320 200 350 200 350 C200 350 135 320 135 285 Z' fill={Colors.surface_base} stroke={Colors.brand_primary} strokeWidth='4' />

    <Circle cx='200' cy='240' r='50' fill='none' stroke={Colors.brand_primary} strokeWidth='4' strokeDasharray='10 5' opacity='0.6' />
    <Line x1='105' y1='240' x2='295' y2='240' stroke={Colors.brand_primary} strokeWidth='4' opacity='0.6' />
    <Circle cx='200' cy='240' r='10' fill={Colors.brand_primary} opacity='0.6' />

    <Circle cx='200' cy='240' r='65' fill={Colors.surface_screen} />
    <Circle cx='200' cy='240' r='50' fill={Colors.brand_primary} />

    <Line x1='200' y1='210' x2='200' y2='270' stroke={Colors.surface_screen} strokeWidth='14' strokeLinecap='round' />
    <Line x1='170' y1='240' x2='230' y2='240' stroke={Colors.surface_screen} strokeWidth='14' strokeLinecap='round' />

    <Path d='M70 60 L85 20 L100 60 L140 75 L100 90 L85 130 L70 90 L30 75 Z' fill={Colors.text_brand} />
    <Path d='M320 130 L325 105 L350 100 L325 95 L320 70 L315 95 L290 100 L315 105 Z' fill={Colors.brand_secondary} />
    <Circle cx='330' cy='280' r='8' fill={Colors.text_brand} />
    <Circle cx='80' cy='260' r='5' fill={Colors.brand_secondary} />
  </Svg>
);

export const CreateTournamentIcon = ({ size = 200 }) => {
  return (
    <Svg width={size} height={size} viewBox='0 0 512 512' fill='none'>
      <Circle cx='256' cy='256' r='210' stroke={Colors.surface_elevated} strokeWidth='2' strokeDasharray='10 10' />

      <Path d='M400 256C400 176.47 335.53 112 256 112C176.47 112 112 176.47 112 256' stroke={Colors.text_tertiary} strokeWidth='12' strokeLinecap='round' />

      <G transform='translate(40, 220)'>
        <Path d='M80 160C124.183 160 160 124.183 160 80C160 35.8172 124.183 0 80 0C35.8172 0 0 35.8172 0 80C0 124.183 35.8172 160 80 160Z' fill={Colors.text_secondary} />
        <Path d='M160 260V220C160 186.863 133.137 160 100 160H60C26.8629 160 0 186.863 0 220V260' stroke={Colors.brand_primary} strokeWidth='24' strokeLinecap='round' />
      </G>

      <G transform='translate(230, 40)'>
        <Circle cx='26' cy='26' r='40' fill={Colors.surface_base} stroke={Colors.brand_secondary} strokeWidth='8' />
        <Path d='M20 20L32 32M15 32L35 12' stroke={Colors.text_primary} strokeWidth='6' strokeLinecap='round' />
      </G>

      <G transform='translate(360, 180)'>
        <Rect x='10' y='30' width='60' height='50' rx='8' fill={Colors.brand_primary} />
        <Path d='M10 40H0M70 40H80' stroke={Colors.brand_primary} strokeWidth='8' strokeLinecap='round' />
        <Rect x='30' y='80' width='20' height='15' fill={Colors.brand_primary} />
        <Rect x='20' y='95' width='40' height='8' rx='4' fill={Colors.brand_primary} />
      </G>

      <G transform='translate(280, 360)'>
        <Circle cx='40' cy='40' r='35' stroke={Colors.text_brand} strokeWidth='12' strokeDasharray='15 10' />
        <Circle cx='40' cy='40' r='12' fill={Colors.text_brand} />
      </G>

      <Circle cx='420' cy='380' r='50' fill={Colors.brand_primary} />
      <Path d='M410 360L440 380L410 400V360Z' fill={Colors.on_brand} />
    </Svg>
  );
};

export const CreateTeamIcon = ({ size = 200 }) => {
  return (
    <Svg width={size} height={size} viewBox='0 0 512 512' fill='none'>
      <Circle cx='256' cy='256' r='220' stroke={Colors.surface_elevated} strokeWidth='10' strokeDasharray='20 15' />
      <G transform='translate(116, 116)'>
        <Circle cx='140' cy='140' r='130' stroke={Colors.text_tertiary} strokeWidth='10' />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <Rect key={index} x='125' y='-10' width='30' height='30' rx='5' fill={Colors.surface_elevated} transform={`rotate(${angle} 140 140)`} />
        ))}
      </G>

      <G transform='translate(130, 160)'>
        <Circle cx='50' cy='50' r='40' fill={Colors.text_secondary} />
        <Path d='M0 160V140C0 112.386 22.3858 90 50 90H50C77.6142 90 100 112.386 100 140V160' stroke={Colors.text_secondary} strokeWidth='15' strokeLinecap='round' />

        <Circle cx='202' cy='50' r='40' fill={Colors.text_secondary} />
        <Path d='M152 160V140C152 112.386 174.386 90 202 90H202C229.614 90 252 112.386 252 140V160' stroke={Colors.text_secondary} strokeWidth='15' strokeLinecap='round' />

        <Circle cx='126' cy='40' r='45' fill={Colors.brand_secondary} />
        <Path d='M66 160V130C66 96.8629 92.8629 70 126 70H126C159.137 70 186 96.8629 186 130V160' stroke={Colors.brand_secondary} strokeWidth='20' strokeLinecap='round' />
      </G>

      <G transform='translate(196, 350)'>
        <Circle cx='60' cy='60' r='70' fill={Colors.brand_primary} />
        <Path d='M60 30V90M30 60H90' stroke={Colors.on_brand} strokeWidth='20' strokeLinecap='round' />
      </G>
    </Svg>
  );
};
