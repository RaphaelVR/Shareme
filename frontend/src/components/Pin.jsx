import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { client, urlFor } from "../client";
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin: { postedBy, image, sub, destination, save }}) => {
  const [postHovered, setPostHovered] = useState(false);

  const user = fetchUser();
  // console.log(user)

  let alreadySaved = Pin?.save?.filter((item) => item?.postedBy?.sub === user?.sub);

  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  const savePin = (id) => {
    if (alreadySaved?.length === 0) {

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: user?.sub,
          postedBy: {
            _type: 'postedBy',
            _ref: user?.sub,
          },
        }])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      })
  }

  const navigate = useNavigate();
  return (
    <div className='m-2'>
      <div
      onMouseEnter={() => setPostHovered(true)}
      onMouseLeave={() => setPostHovered(false)}
      onClick={() => navigate(`/pin-detail/${sub}`)}
      className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
      {image && (
        <img className="rounded-lg w-full " src={(urlFor(image).width(250).url())} alt="user-post" /> )}
      {postHovered && (
        <div
          className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
          style={{ height: '100%'}}
        >
          <div className='flex items-center justify-between'>
            <div className='flex-gap-2'>
              <a
                href={`${image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            {alreadySaved ? (
              <button
              type="button"
              className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-4 py-1 text-base rounded-full hover:shadow-md outline-md'
              >
                {save?.lenght} Saved
              </button>
            ) : (
              <button
              onClick={(e) => {
                e.stopPropagation();
                savePin(sub);
              }}
              type="button"
              className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-4 py-1 text-base rounded-full hover:shadow-md outline-md'
              >
                Save
              </button>
            )}
          </div>
          <div className='flex justify-between items-center gap-2 w-full'>
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.slice(8, 20)}
                </a>
              )}
              {postedBy?.sub === user?.sub && (
                <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  deletePin(sub);
                }}
                className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                >
                  <AiTwotoneDelete />
                </button>
              )};
          </div>
        </div>
      )}
      </div>

      <Link to={`user-profile/${postedBy?.sub}`} className="flex gap-2 mt-2 items-center">
        <img
          className='w-8 h-8 rounded-full object-cover'
          src={postedBy?.picture}
          alt="user-pic"
        />
        <p className='font-semibold capitalize'>{postedBy?.userName} * </p>
      </Link>
    </div>
  )
}

export default Pin