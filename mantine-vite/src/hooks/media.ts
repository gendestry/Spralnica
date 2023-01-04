import { useMediaQuery } from "@mantine/hooks";

export const useIsMobile = () => {
  const mobile = useMediaQuery("(max-width: 766px)");
  return mobile;
};
