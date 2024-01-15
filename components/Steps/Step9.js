import React, { useRef, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import MyTips from "../MyTips";
import AppContext from "../../Context/AppContext";

export default function Step9() {
  const myForm = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  const [send, setSend] = useState(false);
  const [emailError, setEmailError] = useState(null);

  const { step, setStep, userData, calculatedDataAll } = useContext(AppContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const config = {
    headers: {
      "X-API-Account": "462848",
      "X-API-Key":
        "y5mf8Y0i1fhJo6SVTvZP3q.TxVur7PGvoLQuqOe3CaYlIZ7tVJJhJJY5wG8YosUpX0yDs0AO2hw7fk2.m1CStzSeX6t3j6kSKL5xvTYgVuwJxSdzHtdDbMVpRQfTMIKp",
    },
  };

  const calculatedDa = Array.from(
    { length: 37 },
    (_, index) => calculatedDataAll?.[index] || ""
  ).join(" ");

  const onSubmit = async (data) => {
    setSend(true);
    setEmailError(null); // reset the email error before sending

    const sendData = {
      Eigentuemer: userData.step1 === "Nein" ? false : true,
      Name: data.name,
      plz: parseInt(userData.step6),
      telefon: data.telefon,
      email: data.email,
      stromverbrauch: parseInt(userData.step2.consumo),
      interesse_finanzierung: userData.step4,
      dachform: userData.step3,
      art_heizung: userData.step5,
      leadherkunft: "https://fe.solar-pvcheck.de/",
      Bemerkungen: calculatedDa,
    };

    // Assume success initially

    try {
      const response = await axios.post(
        `https://fe-partnerportal.de/FE_API/lead_api/v1/lead`,
        sendData,
        config
      );

      window.gtag("event", "Angebot erhalten");
      myForm.current.reset();
      setEmailError(null); // Reset any previous email error

      // Only move to the next step here
      setStep(step + 1);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (
          error.response.data.message.includes(
            "Die übergebene Emailadresse ist bereits im System bekannt"
          )
        ) {
          setEmailError(
            "Ihre E-Mail ist bereits im System hinterlegt, Ihre Anfrage wurde bereits bearbeitet."
          );
        }
        // Ensure we DON'T advance to the next step
        return;
      } else {
        console.log(error);
      }
      setSend(false);
    }

    const Data = {
      Eigentuemer: userData.step1 === "Nein" ? false : true,
      name: data.name,
      plz: parseInt(userData.step6),
      telefon: data.telefon,
      email: data.email,
      stromverbrauch: parseInt(userData.step2.consumo),
      interesse_finanzierung: userData.step4,
      dachform: userData.step3,
      art_heizung: userData.step5,
      leadherkunft: "https://fe.solar-pvcheck.de/",
      Bemerkungen: calculatedDa,
      project: "FEleads"
    };

    await axios
      .post(
        `https://fe-lead-commen-api.rejoicehub.com/FE_API/lead_api/v1/contact`,
        Data,
        config
      )
      .then((res) => {
        myForm.current.reset();
        setStep(step + 1);
      })
      .catch((error) => {
        console.log(error);
        setSend(false);
      });
  };

  return (
    <div data-show={step == 9 ? true : false} className="step">
      <h1 className="font-visby lg:text-3xl text-xl font-bold lg:max-w-4xl md:max-w-sm">
        Erhalten Sie jetzt Ihr Top-Angebot von unseren Photovoltaik Fachpartnern
        aus Ihrer Region.
      </h1>
      <form ref={myForm} onSubmit={handleSubmit(onSubmit)} className="mt-7">
        <div className="flex lg:space-x-10 lg:flex-row flex-col lg:space-y-0 space-y-4">
          <div className="flex flex-col  relative space-y-2 lg:w-1/2">
            <label htmlFor="name" className="text-left font-bold font-visby">
              {`Vor- & Nachname*`}
            </label>
            <input
              id="name"
              type="text"
              className="px-4 py-2 md:py-3 outline-none border border-[#1D1D1B] rounded-sm"
              {...register("name", { required: false })}
            />
            {errors.name && (
              <MyTips text="Bitte überprüfen Sie ihre Eingabe." />
            )}
          </div>
          <div className="flex flex-col  relative space-y-2 lg:w-1/2">
            <label htmlFor="telefon" className="text-left font-bold font-visby">
              Telefonnummer *
            </label>
            <input
              id="telefon"
              type="number"
              className="px-4 py-2 md:py-3 outline-none border border-[#1D1D1B] rounded-sm"
              {...register("telefon", { required: false })}
            />
            {errors.telefon && (
              <MyTips text="Bitte überprüfen Sie ihre Eingabe." />
            )}
          </div>
        </div>
        <div className="flex flex-col  relative mt-4 space-y-2">
          <label htmlFor="email" className="text-left font-bold font-visby ">
            E-Mailadresse *
          </label>
          <input
            type="email"
            className="px-4 py-2 md:py-3 outline-none border border-[#1D1D1B] rounded-sm"
            {...register("email", {
              required: false,
              pattern:
                "^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$",
            })}
          />
          {emailError && <div className="text-red-500 mt-1">{emailError}</div>}
          {errors.email?.type === "required" && (
            <MyTips text="Bitte überprüfen Sie ihre Eingabe." />
          )}
          {errors.email?.type === "pattern" && (
            <MyTips text="Bitte überprüfen Sie ihre Eingabe." />
          )}
        </div>
        <div className="mt-4">
          <label className="container_check text-xs font-visby">
            Mit dem Absenden meiner Anfrage akzeptiere ich die AGB und, dass ich
            die Datenschutzerklärung zur Kenntnis genommen habe.
            <input type="checkbox" {...register("agree", { required: true })} />
            <span className="checkmark" />
          </label>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="mt-4 bg-[#a3195b] items-center justify-center flex outline-none relative lg:px-12 lg:text-base md:px-8 font-visby font-bold py-3 rounded-md hover:cursor-pointer text-white transition-all ease-in-out duration-150 hover:bg-opacity-90 hover:shadow-md hover:shadow-[#a3195b] md:text-sm md:w-auto text-sm w-full"
          >
            <div className="absolute w-full flex justify-center items-center bg-slate-300 z-30">
              <svg
                className={`animate-spin h-5 w-5 text-white absolute${
                  send ? " block " : " hidden "
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <span className={`${send ? "opacity-0" : "opacity-1"}`}>
              Angebote erhalten kostenlos & unverbindlich
            </span>
          </button>
        </div>
        <p className="mt-4 font-visby">
          Wir können Ihnen Informationen über ähnliche Produkte und Leistungen
          per E-Mail zusenden. Ein Widerspruch ist jederzeit hier möglich.
        </p>
      </form>
    </div>
  );
}
