import { useDispatch, useSelector } from "react-redux";
import FormSectionCard from "./FormSectionCard";
import { useEffect } from "react";
import {
  setAssemblies,
  setError,
  setLoading,
  setPollingStations,
  setSuccess,
  updateField,
} from "../../store/slices/form6Slice";
import { locationApis } from "../../services/locationApis";
import { toast } from "react-toastify";
import Loading from "../Loading";

export default function LocationSection() {
  const form6Data = useSelector((state) => state.form6);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));

    async function fetchDate() {
      try {
        const assemblies = await locationApis.fetchAssemblyStation();
        const pollingStation = await locationApis.fetchPollingStation();

        dispatch(setAssemblies(assemblies));
        dispatch(setPollingStations(pollingStation));

        dispatch(setSuccess(true));
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setError("Error while fetching assemblies." + error));

        toast("Error while fetch assemly data ");

        dispatch(setLoading(false));
      }
    }

    fetchDate();
  }, []);
  if (form6Data.isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (form6Data.error) {
    return (
      <FormSectionCard title="A. Select State, District & Assembly Constituency">
        <div className="border rounded p-4 bg-red-50">
          <p className="text-red-600">Error: {form6Data.error}</p>
        </div>
      </FormSectionCard>
    );
  }

  return (
    <FormSectionCard title="A. Select State, District & Assembly Constituency">
      <div className="border rounded p-4 bg-gray-50">
        <h2 className="font-semibold mb-3">Location Details</h2>

        <select
          required
          name="assemblies"
          className="input"
         value={form6Data.assemblyConstituencyId || ""}
          onChange={(e) => {
            dispatch(
              updateField({
                fieldName: "assemblyConstituencyId",
                value: Number(e.target.value),
              }),
            );
          
          }}
        >
          <option value="">Select Assembly Constituency</option>
          {form6Data.assemblies.map((assembly) => (
            <option
            value={assembly.id}
              key={assembly.id}
               onChange={  ()=> dispatch(
              updateField({ fieldName: "assemblyName", value: assembly.constituencyName }),
            )}
             
            >
              {assembly.constituencyName}
            </option>
          ))}
        </select>

        <select
          required
          name="polling-stations"
          className="input mt-2"
          
          value={form6Data.pollingStationId || ""}
          onChange={(e) => {
            dispatch(
              updateField({
                fieldName: "pollingStationId",
                value: Number(e.target.value),
              }),
            );

            
          }}
        >
          <option value="">Select Polling Station</option>
          {form6Data.pollingStations.map((station) => (
            <option key={station.id } onChange={()=> dispatch(
              updateField({ fieldName: "pollingName", value: station.stationName }),
            )}  value={station.id}  >
              {station.stationName}
            </option>
          ))}
        </select>

        {/* <input className="input mt-2" placeholder="Part Number (Optional)" /> */}
      </div>
    </FormSectionCard>
  );
}
