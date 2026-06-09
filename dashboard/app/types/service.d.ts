export interface ServicePillar {
  id: string;
  title: string;
  icon: string;
  description: string;
  specs: string[];
  videoUrl?: string;
}

export interface PillarModuleProps {
  pilar: ServicePillar;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}
