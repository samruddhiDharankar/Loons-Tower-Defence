export type Position = {
  position_x: number;
  position_y: number;
  level: number;
};

export type LoonStateMessage = {
  loonState: {
    [key: string]: Position;
  };
};
