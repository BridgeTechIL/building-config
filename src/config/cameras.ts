interface FloorCameras {
    [key: string]: string[];  // floorId: array of camera URLs
  }
  
  // export const floorCameras: FloorCameras = {
  //   '0': [  // Ground Floor
  //     'https://player.castr.com/live_1deb88e0b56e11ef8f0e3fcb84ef4d27',
  //     'https://player.castr.com/live_49951be0b8a811ef85bba9d97c23f922',
  //     'https://player.castr.com/live_8d7953d0b8a811ef9f23656d568329c4',
  //   ],
  //   '1': [  // First Floor
  //     'https://player.castr.com/live_bff18df0b8a811ef9f23656d568329c4',
  //     'https://player.castr.com/live_e184fba0b8a811ef89440b2e5be5392d',
  //     'https://player.castr.com/live_161c1e20b8a911efaa8d43f7544758cb',
  //   ],
  //   // Add more floors as needed
  // };


export const floorCameras: FloorCameras = {
  '0': [  // Ground Floor
    '/videos/floor.mp4',
    '/videos/floor.mp4',
    '/videos/floor.mp4',
  ],
  '1': [  // First Floor
    '/videos/floor.mp4',
    '/videos/floor.mp4',
    '/videos/floor.mp4',
  ],
  // Add more floors as needed
};