import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress, TextField, Chip } from '@mui/material';
// If you have a Quest type/interface, import it here
// import { Quest } from '../../types';

// Dummy data for demonstration – replace with API/web3 fetch
const mockQuests = [
  {
    id: '1',
    title: 'The Forgotten Temple',
    description: 'Explore the ancient temple and retrieve the hidden artifact.',
    tags: ['adventure', 'exploration'],
    status: 'Active',
    reward: '500 XP',
  },
  {
    id: '2',
    title: 'The Coded Enigma',
    description: 'Solve the cryptic puzzle to unlock the next realm.',
    tags: ['puzzle', 'logic'],
    status: 'Completed',
    reward: '250 XP',
  },
  // ...more quests
];

const Questboard: React.FC = () => {
  const [quests, setQuests] = useState<typeof mockQuests>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    // Replace with real data fetch
    setTimeout(() => {
      setQuests(mockQuests);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleFilter = useCallback((tag: string) => {
    setFilter(tag);
  }, []);

  const tags = useMemo(() => {
    const allTags = new Set<string>();
    mockQuests.forEach(q => q.tags.forEach(t => allTags.add(t)));
    return ['All', ...Array.from(allTags)];
  }, []);

  const filteredQuests = useMemo(() => {
    let result = quests;
    if (filter !== 'All') {
      result = result.filter(q => q.tags.includes(filter));
    }
    if (search.trim()) {
      result = result.filter(q =>
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [quests, filter, search]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Quest Board
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Embark on epic quests, solve enigmas, and claim your rewards!
      </Typography>

      <Box display="flex" gap={2} alignItems="center" my={3}>
        <TextField
          label="Search quests"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          size="small"
          sx={{ minWidth: 220 }}
        />
        {tags.map(tag => (
          <Chip
            key={tag}
            label={tag}
            color={filter === tag ? 'primary' : 'default'}
            onClick={() => handleFilter(tag)}
            clickable
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {filteredQuests.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary">
              No quests found.
            </Typography>
          </Grid>
        ) : (
          filteredQuests.map(quest => (
            <Grid item xs={12} sm={6} md={4} key={quest.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: 'transform 0.15s',
                  '&:hover': { transform: 'translateY(-4px) scale(1.03)' },
                }}
              >
                <CardContent>
                  <Typography variant="h5" fontWeight={600}>
                    {quest.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" my={1}>
                    {quest.description}
                  </Typography>
                  <Box mb={1}>
                    {quest.tags.map(tag => (
                      <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </Box>
                  <Typography variant="caption" color={quest.status === 'Active' ? 'success.main' : 'text.secondary'}>
                    {quest.status}
                  </Typography>
                  <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={500}>
                      Reward: {quest.reward}
                    </Typography>
                    {quest.status === 'Active' && (
                      <Button variant="contained" size="small" color="primary">
                        Start Quest
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Questboard;
