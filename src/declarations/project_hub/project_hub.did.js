export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Project = IDL.Record({
    'id' : IDL.Text,
    'metadata' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'capacity' : IDL.Nat,
    'location' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : Project, 'err' : IDL.Text });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Vec(IDL.Text), 'err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const ProjectHub = IDL.Service({
    'create_opportunity' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'create_project' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Text],
        [Result],
        [],
      ),
    'get_project_stats' : IDL.Func([IDL.Text], [Result_1], []),
    'list_opportunities' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text)],
        [Result_3],
        [],
      ),
    'log_energy_production' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat64],
        [Result_2],
        [],
      ),
    'post_update' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result_2], []),
    'submit_dispute' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Text)],
        [Result_1],
        [],
      ),
    'update_status' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
  });
  return ProjectHub;
};
export const init = ({ IDL }) => { return []; };
