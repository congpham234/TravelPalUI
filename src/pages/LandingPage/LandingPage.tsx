import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../components/CustomButton';
import Typography from '../../components/Typography';
import { FiMenu } from 'react-icons/fi';
import styles from './LandingPage.module.scss';
import NewDateRangePicker from '../../components/CustomDateRangePicker';
import SearchInput from '../../components/SearchInput';
import NewSelect from '../../components/NewSelect';

import { Destination, SearchDestinationResponseContent } from 'gopalapimodel';
import apiClient from '../../configs';

function LandingPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const navigate = useNavigate();

  const handleOnSearchDestination = async (
    value: string
  ): Promise<Array<{ key: string; imageUrl: string; title: string }>> => {
    try {
      if (!value) return [];

      const response: SearchDestinationResponseContent =
        await apiClient.searchDestination(value);
      const destinations: Array<Destination> = response.destinations ?? [];

      let autoSuggestOptions = [];
      for (const destination of destinations) {
        if (destination.imageUrl) {
          const title = [
            destination.name,
            destination.cityName,
            destination.country,
          ]
            .filter(Boolean)
            .join(', ');

          autoSuggestOptions.push({
            key: destination.destId,
            imageUrl: destination.imageUrl,
            title: title,
          });
        }
      }

      setDestinations(destinations);
      return autoSuggestOptions;
    } catch (error) {
      console.error('Failed to fetch search result:', error);
      return [];
    }
  };

  const handleOnSelectDestination = (destinationKey: string) => {
    const destination = destinations.find(
      (dest) => dest.destId === destinationKey
    );
    setSelectedDestination(destination || null);
  };

  const handlePlanMyTrip = () => {
    if (selectedDestination) {
      navigate('/itinerary', { state: { destination: selectedDestination } });
    }
  };

  return (
    <div className={styles.LandingPage}>
      <div className={styles.NavBar}>
        <img src="/images/GoPal-logo.svg" alt="GoPal Logo" />
        <div className={styles.Icon2rem}>
          <FiMenu />
        </div>
      </div>

      <div className={styles.Hero}>
        <img src="/images/GoPal-star.jpeg" alt="GoPal Star" />
        <Typography variant="h2"> Your AI Trip Assistant </Typography>
      </div>
      <div className={styles.InputSection}>
        <Typography variant="h3">Start planning your trip</Typography>
        <SearchInput
          placeholder="Search by city or town"
          onSearch={handleOnSearchDestination}
          onSelect={handleOnSelectDestination}
        />
        <NewDateRangePicker />
        <NewSelect />
        <CustomButton customVariant="primary" onClick={handlePlanMyTrip}>
          Plan My Trip
        </CustomButton>
      </div>
    </div>
  );
}

export default LandingPage;
