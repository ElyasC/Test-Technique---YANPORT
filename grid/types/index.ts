type Nullable<T> = T | null;
type Grid = { width: number, height: number };
type Orientation = 'N' | 'E' | 'W' | 'S';
type Player = { x: number, y: number, orientation: Orientation };
type Rotation = 'D' | 'G';
type Command = 'D' | 'G' | 'A';
type Movement = [number, number];
type _Map<T> = { [key: string]: T };
