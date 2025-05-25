import { useState } from 'react';
import { useNavigate } from 'react-router';
import { signUpController } from '../controllers/authController';

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await signUpController(email, password, name);

            if (result.success) {
                navigate('/');
            } else {
                setError(result.error.message || 'Failed to sign up');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
                <h2 className="text-[#111418] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Create
                    your account</h2>
                {error && (
                    <div className="mx-4 p-3 bg-red-100 text-red-700 rounded-lg mb-3">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSignUp}>
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-[#111418] text-base font-medium leading-normal pb-2">Name</p>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#60748a] p-[15px] text-base font-normal leading-normal"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-[#111418] text-base font-medium leading-normal pb-2">Email</p>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#60748a] p-[15px] text-base font-normal leading-normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-[#111418] text-base font-medium leading-normal pb-2">Password</p>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#60748a] p-[15px] text-base font-normal leading-normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="flex px-4 py-3">
                        <button
                            type="submit"
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#0c77f2] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                            disabled={loading}
                        >
                            <span className="truncate">{loading ? 'Signing up...' : 'Sign Up'}</span>
                        </button>
                    </div>
                </form>
                <p className="text-[#60748a] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">
                    <a href="/signIn">Already have an account? Sign in</a>
                </p>
            </div>
        </div>
    )
}

export default SignUpPage;
