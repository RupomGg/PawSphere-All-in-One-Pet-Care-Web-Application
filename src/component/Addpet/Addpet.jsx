import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../provider/Authprovider';
import '../Desgine/Addpet.css';
import Swal from 'sweetalert2';

const Addpet = () => {
  const { userInfo } = useContext(AuthContext);
  console.log('user', userInfo);
  
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleAdd = (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const name = form.get('name');
        const dob = form.get('dob');
        const breed = form.get('breed');
        const image = form.get('image');
        const description = form.get('description');
        const owner = userInfo._id;

        const petInfo = { name, dob, breed, image, description, owner };
        console.log('Submitting:', petInfo);

        fetch('http://localhost:3000/add-pet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(petInfo)
        })
            .then(async res => {
                const contentType = res.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Server did not return valid JSON');
                }

                const data = await res.json();

                if (res.ok) {
                    Swal.fire({
                        title: 'Pet Added!',
                        text: 'Your pet profile has been successfully added.',
                        icon: 'success',
                        confirmButtonText: 'Great!'
                    }).then(result => {
                        if (result.isConfirmed) {
                            navigate('/user-home');
                        }
                    });
                    e.target.reset();
                    setErrorMsg('');
                } else {
                    setErrorMsg(data.message || 'Failed to add pet');
                }
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setErrorMsg('Something went wrong. Please try again.');
            });
    };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="title">Add Pet Profile</h1>
        {errorMsg && (
          <div className="error-msg">{errorMsg}</div>
        )}

        <form onSubmit={handleAdd} className="space-y-5">
          <div className="form-group">
            <label className="label">Pet Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter pet name"
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">Date of Birth</label>
            <input
              type="date"
              name="dob"
              required
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">Breed</label>
            <input
              type="text"
              name="breed"
              required
              placeholder="Enter breed"
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">Image URL</label>
            <input
              type="url"
              name="image"
              required
              placeholder="https://example.com/your-pet.jpg"
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">Description</label>
            <textarea
              name="description"
              rows="3"
              required
              placeholder="Tell us something special about your pet (max 70 words)"
              maxLength="350"
              className="textarea"
            ></textarea>
            <span className="text-sm text-white/70">Max 70 words</span>
          </div>

          <button type="submit" className="button">
            Add Pet
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addpet;
