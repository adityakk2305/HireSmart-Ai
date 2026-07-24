import { Save, Upload, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getProfileRequest, updateProfileRequest, uploadProfileImageRequest } from "../../api/userApi.js";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";
import { useDispatch } from "react-redux";
import { updateAuthenticatedUser } from "../../features/auth/authSlice.js";
import { formatDate } from "../../utils/formatDate.js";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm();

  useEffect(() => {
    getProfileRequest()
      .then((data) => {
        setProfile(data.user);
        setCompany(data.company);
        reset(data.user);
      })
      .catch(() => toast.error("Unable to load profile"))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const data = await updateProfileRequest({
        name: values.name,
        phone: values.phone,
        profileImage: values.profileImage
      });
      setProfile(data.user);
      dispatch(updateAuthenticatedUser(data.user));
      reset(data.user);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const data = await uploadProfileImageRequest(file);
      setProfile(data.user);
      dispatch(updateAuthenticatedUser(data.user));
      reset(data.user);
      toast.success("Profile image uploaded");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to upload profile image");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading profile" />;
  }

  return (
    <div>
      <PageHeader title="Profile" description="Manage your personal account details." />
      <form className="grid gap-6 xl:grid-cols-[1fr_320px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Name" error={errors.name?.message} {...register("name", { required: "Name is required", minLength: { value: 2, message: "Use at least 2 characters" } })} />
            <Input label="Phone" {...register("phone")} />
            <Input label="Profile image URL" {...register("profileImage")} />
            <Input label="Email" disabled value={profile?.email || ""} onChange={() => {}} />
            <Input label="Role" disabled value={profile?.role || ""} onChange={() => {}} />
            <Input label="Company" disabled value={company?.name || "Not assigned"} onChange={() => {}} />
            <Input label="Account created" disabled value={profile?.createdAt ? formatDate(profile.createdAt) : ""} onChange={() => {}} />
            <Input label="Last login" disabled value={profile?.lastLoginAt ? formatDate(profile.lastLoginAt) : "Not available"} onChange={() => {}} />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={!isDirty} onClick={() => reset(profile)}>
              Cancel
            </Button>
            <Button type="submit" icon={Save} loading={saving} disabled={!isDirty}>
              Save profile
            </Button>
          </div>
        </div>
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
            {profile?.profileImage ? <img src={profile.profileImage} alt={profile.name} className="h-full w-full object-cover" /> : <UserCircle className="h-20 w-20 text-slate-400" />}
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-950">{profile?.name}</h2>
          <p className="text-sm uppercase text-slate-500">{profile?.role}</p>
          <label className="mt-5 block">
            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImageUpload} />
            <span className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Upload className="h-4 w-4" /> Upload image
            </span>
          </label>
        </aside>
      </form>
    </div>
  );
};

export default ProfilePage;
