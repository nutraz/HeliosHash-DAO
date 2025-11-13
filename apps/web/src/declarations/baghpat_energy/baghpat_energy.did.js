export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getLocation' : IDL.Func([], [IDL.Text], ['query']),
    'getPanelCount' : IDL.Func([], [IDL.Nat], ['query']),
    'getSolarEnergy' : IDL.Func([], [IDL.Nat], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
