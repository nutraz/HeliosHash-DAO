export const idlFactory = ({ IDL }) => {
  const ComputeMode = IDL.Variant({
    'AI' : IDL.Null,
    'Hybrid' : IDL.Null,
    'Bitcoin' : IDL.Null,
  });
  const ComputeStats = IDL.Record({
    'efficiency' : IDL.Float64,
    'hashRate' : IDL.Float64,
    'revenue' : IDL.Float64,
    'mode' : ComputeMode,
    'lastUpdated' : IDL.Int,
    'powerConsumption' : IDL.Float64,
    'aiWorkloads' : IDL.Nat,
  });
  const PivotDecision = IDL.Record({
    'trigger' : IDL.Text,
    'estimatedImpact' : IDL.Float64,
    'threshold' : IDL.Float64,
    'timestamp' : IDL.Int,
    'newMode' : ComputeMode,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'emergencyShutdown' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'getComputeStatus' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [
          IDL.Record({
            'mode' : ComputeMode,
            'stats' : IDL.Opt(ComputeStats),
            'pivotHistory' : IDL.Vec(IDL.Tuple(IDL.Nat, PivotDecision)),
          }),
        ],
        ['query'],
      ),
    'getPivotRecommendations' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'recommendedMode' : ComputeMode,
              'estimatedGain' : IDL.Float64,
              'confidence' : IDL.Float64,
              'reason' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'healthCheck' : IDL.Func(
        [],
        [
          IDL.Record({
            'status' : IDL.Text,
            'activeUsers' : IDL.Nat,
            'totalAIWorkloads' : IDL.Nat,
            'totalHashRate' : IDL.Float64,
            'averageEfficiency' : IDL.Float64,
          }),
        ],
        ['query'],
      ),
    'pivotComputeMode' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Float64],
        [Result_1],
        [],
      ),
    'updateComputeStats' : IDL.Func(
        [IDL.Float64, IDL.Nat, IDL.Float64, IDL.Float64],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
