import React, { useState, useEffect } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Error from  "../components/Error"
import MissingDraw from  "../components/MissingDraw"
import Loading from  "../components/Loading"
import { useIntl } from "gatsby-plugin-intl"
import { getBoardDetails, getUser } from '../services/board'

const MemberPage = ({location}) => {
  const intl = useIntl();
  const [boardName, setBoardName] = useState('');
  const [drawName, setDrawName] = useState(false);
  const [description, setDescription] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isDraw, setIsDraw] = useState(true);
  const [error, setError] = useState(false);
  const [lid, setLid] = useState();
  const [uid, setUid] = useState();

  useEffect(() => {
    const lidMatch = location.search.match(/lid=([^&]*)/);
    const uidMatch = location.search.match(/uid=([^&]*)/);
    if(uidMatch && lidMatch) {
      setLid(lidMatch[1]);
      setUid(uidMatch[1]);
      getBoardDetails(lidMatch[1])
      .then((details) => {
        setBoardName(details.name);
        setIsDraw(details.isDraw);
      })
      .then(() => getUser(lidMatch[1],uidMatch[1]))
      .then((user) => {
        if(user.draw) {
          setDrawName(user.draw);
          setDescription(user.drawDescription);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(()=> {
        setIsPageLoading(false);
      })
    }

  }, [location]);

  if(isPageLoading) return <Loading />
  if(!lid || !uid || error) return <Error />
  if(isDraw && !drawName) return <MissingDraw />

  return (
  <Layout
  footer={<div>{intl.formatMessage({ id: "m_bookmark" })}</div>}>
    <SEO title={intl.formatMessage({ id: "member" })}/>
    <h1>{boardName}</h1>
    <h2>{intl.formatMessage({ id: "m_santa_for" })}</h2>
    {!drawName && <div>{intl.formatMessage({ id: "m_waiting_for" })}</div>}
    {drawName && <h1>{drawName} </h1>}
    {description &&
      <h2>
        {description}
      </h2>
    }
  </Layout>);
}

export default MemberPage
