import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import SelectDropdown from '../../../../components/SelectDropdown';
import { isEmpty } from 'lodash';
import { convertOptions } from '../../../../utils';

import { connect } from 'react-redux';
import { getTeamList } from 'store/action/TeamAction';

export function TeamSelector({ setActiveFilter, activeFilter, teamList }) {
  const [compiledTeamList, setCompiledTeamList] = useState([]);

  useEffect(() => {
    if (!isEmpty(teamList.currentElements)) {
      // initial value
      const tmp = teamList.currentElements;
      const compiled = [
        {
          id: '',
          name: 'All Team',
        },
        ...tmp,
      ];
      setCompiledTeamList(compiled);
    }
  }, [teamList]);

  const onTeamChange = (value) => {
    if (value !== '') {
      setActiveFilter({
        ...activeFilter,
        team: parseInt(value),
      });
    } else {
      setActiveFilter({
        ...activeFilter,
        team: '',
      });
    }
  };

  return (
    <div className="mb-40">
      <div className="fw-bold text-base mb-20">Team</div>
      <Row gutter={20}>
        <Col span={6}>
          <SelectDropdown
            options={
              !isEmpty(compiledTeamList)
                ? convertOptions(compiledTeamList, 'name', 'id')
                : []
            }
            placeHolder={'Select Team'}
            defaultValue={''}
            onChange={onTeamChange}
          />
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = ({ teamList }) => ({ teamList });

export default connect(mapStateToProps, { getTeamList })(TeamSelector)
