export const ToolDummyData = {
  name: "Google Analytics",
  constants: {
    constant1: {
      value: "constant1",
      overrideValues: [
        {
          value: "c2e1",
          containerId: 2,
          environmentId: 1,
        },
        {
          value: "c1e1",
          containerId: 1,
          environmentId: 1,
        },
      ],
    },
    constant2: {
      value: "constant1",
      overrideValues: [
        {
          value: "c1c1",
          containerId: 1,
          environmentId: 1,
        },
        {
          value: "c2e1",
          containerId: 2,
          environmentId: 1,
        },
      ],
    },
  },
};

export const allContainerIds = [1, 2];
export const allEnvironmentIds = [1, 2];
