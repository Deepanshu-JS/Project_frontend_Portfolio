export interface Skill {
  name: string;
  icon: string; // Lucide icon name (kebab-case)
  color: string; // hex color without #
  level: number; // 0-100
}

export const skills: Skill[] = [
  { name: "React", icon: "atom", color: "61DAFB", level: 95 },
  { name: "TypeScript", icon: "file-code-2", color: "3178C6", level: 90 },
  { name: "JavaScript", icon: "braces", color: "F7DF1E", level: 95 },
  { name: "Next.js", icon: "triangle", color: "808080", level: 85 },
  { name: "Tailwind CSS", icon: "wind", color: "06B6D4", level: 92 },
  { name: "Node.js", icon: "hexagon", color: "339933", level: 80 },
  { name: "Framer Motion", icon: "sparkles", color: "FF0055", level: 88 },
  { name: "Three.js", icon: "box", color: "888888", level: 70 },
  { name: "Figma", icon: "figma", color: "F24E1E", level: 85 },
  { name: "Git", icon: "git-branch", color: "F05032", level: 90 },
];
