import type { OtpProps } from "../../Interface/types";

export const Otp: React.FC<OtpProps> = ({ otpValue, setOtpValue ,className }) => {
  return (
    <input
      type="text"
      name="otp"
      id="otpFeild"
      value={otpValue}
      onChange={(e) => setOtpValue(e.target.value)}
      placeholder="Enter OTP"
      className={className}
    />
  );
};
