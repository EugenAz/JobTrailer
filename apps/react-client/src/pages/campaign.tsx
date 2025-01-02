import { Link, useParams, useSearchParams } from 'react-router';
import { formatDate } from '@job-trail/dates';

import { useApplicationDeleter } from '../graphql/use-application-deleter';
import { useCampaignGetter } from '../graphql/use-campaign-getter';
import { MainHeading } from '../components/atoms/main-heading';
import { ButtonLink } from '../components/atoms/button-link';
import { LoadingErrorHandler } from '../components/loading-error-handler';

import styles from './campaign.module.css';
import { Button } from '../components/atoms/button';
import { useEffect, useState } from 'react';
import { ApplicationStatus, IApplicationModel } from '@job-trail/types';
import { getFilteredApplications, STATUS_FILTER_KEY } from './campaign.utils';

export const Campaign = () => {
  const { campaignId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const filterStatus = searchParams.get(STATUS_FILTER_KEY) as ApplicationStatus;
  const [applications, setApplications] = useState<IApplicationModel[]>([]);

  if (!campaignId) {
    throw new Error('campaign ID is missing');
  }

  const { loading, error, data, refetch } = useCampaignGetter(campaignId);
  const [
    deleteApplication,
    { loading: mutationLoading, error: mutationError },
  ] = useApplicationDeleter();

  const campaign = data?.campaign;

  useEffect(() => {
    if (campaign?.applications) {
      const filteredApps = getFilteredApplications(
        campaign.applications,
        filterStatus,
        searchTerm
      );
      setApplications(filteredApps);
    }
  }, [campaign?.applications, filterStatus, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.trim().toLowerCase());
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      const response = await deleteApplication({
        variables: {
          id,
        },
      });

      if (response.data.deleteApplication) {
        await refetch();
      }
    }
  };

  const handleFilterOpenToggleClick = () => {
    setSearchParams((prev) => {
      if (filterStatus === ApplicationStatus.OPEN) {
        prev.delete(STATUS_FILTER_KEY);
      } else {
        prev.set(STATUS_FILTER_KEY, ApplicationStatus.OPEN);
      }
      return prev;
    });
  };

  return (
    <LoadingErrorHandler
      loading={loading || mutationLoading}
      error={error || mutationError}
    >
      <MainHeading>{campaign?.name}</MainHeading>

      <div className="flex gap-4">
        <ButtonLink to={`/campaign/${campaignId}/new-application`}>
          + Add application
        </ButtonLink>

        <Button onClick={handleFilterOpenToggleClick}>
          {filterStatus === ApplicationStatus.OPEN
            ? 'Show all'
            : 'Show only open'}
        </Button>

        <input
          className="border-gray-600 border-2 rounded-md p-2"
          placeholder="Search..."
          onChange={handleSearch}
          value={searchTerm}
        />
      </div>

      <table className="mt-4 rounded-t-lg overflow-hidden">
        <thead className="text-center">
          <tr>
            <th className={styles.thStyle}>Date</th>
            <th className={styles.thStyle}>Company</th>
            <th className={styles.thStyle}>Role</th>
            <th className={styles.thStyle}>Status</th>
            <th className={styles.thStyle}>Date Updated</th>
            <th className={styles.thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {applications?.map((a) => (
            <tr key={a.id}>
              <td className={styles.tdStyle}>{formatDate(a.dateCreated)}</td>
              <td className={styles.tdStyle2}>{a.company.name}</td>
              <td className={styles.tdStyle}>{a.roleName}</td>
              <td className={styles.tdStyle2}>{a.status}</td>
              <td className={styles.tdStyle}>
                {a.dateUpdated ? formatDate(a.dateUpdated) : '-'}
              </td>
              <td className={styles.tdStyle2}>
                <div className="flex gap-2 justify-center">
                  <Link
                    className="underline text-blue-600"
                    to={`/application/${a.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="underline text-red-600"
                    onClick={() => handleDeleteClick(a.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </LoadingErrorHandler>
  );
};
